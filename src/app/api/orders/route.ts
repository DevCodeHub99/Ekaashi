import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, successResponse, APIError } from '@/lib/api-handler'
import { createOrderSchema } from '@/lib/validations'

// POST - Create new order
export const POST = withRateLimit(apiRateLimit, withErrorHandler(async (request: NextRequest) => {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    // Validate with Zod schema
    const validated = createOrderSchema.parse(body)
    const { items, shippingAddress, paymentMethod } = validated

    // Calculate total from items
    let total = 0
    const orderItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      })

      if (!product) {
        throw new APIError(`Product ${item.productId} not found`, 404)
      }

      if (!product.inStock) {
        throw new APIError(`Product ${product.name} is out of stock`, 400)
      }

      const itemTotal = Number(product.price) * item.quantity
      total += itemTotal

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(product.price)
      })
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id || null,
        email: session?.user?.email || shippingAddress.fullName + '@guest.com',
        firstName: shippingAddress.fullName.split(' ')[0],
        lastName: shippingAddress.fullName.split(' ').slice(1).join(' ') || '',
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
        total: total,
        status: 'PENDING',
        items: {
          create: orderItems
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    // Clear cart items for logged-in users
    if (session?.user?.id) {
      await prisma.cartItem.deleteMany({
        where: { userId: session.user.id }
      })
    }

    return successResponse(order, 201)
  })
)

// GET - Fetch user orders
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: orders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}