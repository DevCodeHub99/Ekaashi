import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Save abandoned cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { cartData, sessionId, email } = body

    if (!cartData || cartData.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Cart data is required' },
        { status: 400 }
      )
    }

    const totalItems = cartData.reduce((sum: number, item: any) => sum + item.quantity, 0)
    const totalValue = cartData.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)

    // Check if abandoned cart already exists
    const existingCart = await prisma.abandonedCart.findFirst({
      where: session 
        ? { userId: session.user.id }
        : { sessionId: sessionId! }
    })

    if (existingCart) {
      // Update existing abandoned cart
      const updatedCart = await prisma.abandonedCart.update({
        where: { id: existingCart.id },
        data: {
          cartData,
          totalItems,
          totalValue,
          email: email || session?.user?.email,
          emailSent: false, // Reset email sent flag
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        data: updatedCart,
        message: 'Abandoned cart updated'
      })
    } else {
      // Create new abandoned cart
      const abandonedCart = await prisma.abandonedCart.create({
        data: {
          userId: session?.user.id,
          sessionId: session ? null : sessionId,
          email: email || session?.user?.email,
          cartData,
          totalItems,
          totalValue
        }
      })

      return NextResponse.json({
        success: true,
        data: abandonedCart,
        message: 'Abandoned cart saved'
      })
    }
  } catch (error) {
    console.error('Error saving abandoned cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save abandoned cart' },
      { status: 500 }
    )
  }
}

// GET - Fetch abandoned carts (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const emailSent = searchParams.get('emailSent')

    const where: any = {}
    if (emailSent !== null) {
      where.emailSent = emailSent === 'true'
    }

    const abandonedCarts = await prisma.abandonedCart.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.abandonedCart.count({ where })

    return NextResponse.json({
      success: true,
      data: abandonedCarts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Error fetching abandoned carts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    )
  }
}

// PUT - Mark abandoned cart email as sent
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { cartId, emailSent = true, recovered = false } = body

    if (!cartId) {
      return NextResponse.json(
        { success: false, error: 'Cart ID is required' },
        { status: 400 }
      )
    }

    const updatedCart = await prisma.abandonedCart.update({
      where: { id: cartId },
      data: {
        emailSent,
        recovered,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedCart,
      message: 'Abandoned cart updated'
    })
  } catch (error) {
    console.error('Error updating abandoned cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update abandoned cart' },
      { status: 500 }
    )
  }
}