import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's cart
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!session && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    const cartItems = await prisma.cartItem.findMany({
      where: session 
        ? { userId: session.user.id }
        : { sessionId: sessionId! },
      include: {
        product: {
          include: {
            category: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedItems = cartItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      comparePrice: item.product.comparePrice ? Number(item.product.comparePrice) : undefined,
      image: item.product.images[0] || '',
      category: item.product.category.slug,
      quantity: item.quantity
    }))

    return NextResponse.json({
      success: true,
      data: transformedItems
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST - Add item to cart
export async function POST(request: NextRequest) {
  console.log('=== POST /api/cart START ===')
  try {
    const session = await getServerSession(authOptions)
    console.log('Session retrieved:', !!session)
    
    const body = await request.json()
    console.log('Body parsed:', body)
    
    const { productId, quantity = 1, sessionId } = body
    console.log('Extracted values:', { productId, quantity, sessionId })
    
    // We need either a session (logged-in user) OR a sessionId (guest user)
    if (!session && !sessionId) {
      console.log('No session or sessionId found')
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    if (!productId) {
      console.log('No productId provided')
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    console.log('About to check product in database')
    // Check if product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })
    console.log('Product found:', !!product)

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    if (!product.inStock) {
      return NextResponse.json(
        { success: false, error: 'Product is out of stock' },
        { status: 400 }
      )
    }

    console.log('About to handle cart item')
    let cartItem
    
    if (session) {
      console.log('Using session for logged-in user')
      // For logged-in users - find existing cart item
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          userId: session.user.id,
          productId
        }
      })

      if (existingCartItem) {
        // Update existing cart item
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + quantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        })
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            userId: session.user.id,
            productId,
            quantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        })
      }
    } else {
      console.log('Using sessionId for guest user')
      // For guest users - find existing cart item
      const existingCartItem = await prisma.cartItem.findFirst({
        where: {
          sessionId: sessionId!,
          productId
        }
      })

      if (existingCartItem) {
        // Update existing cart item
        cartItem = await prisma.cartItem.update({
          where: { id: existingCartItem.id },
          data: {
            quantity: existingCartItem.quantity + quantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        })
      } else {
        // Create new cart item
        cartItem = await prisma.cartItem.create({
          data: {
            sessionId: sessionId!,
            productId,
            quantity
          },
          include: {
            product: {
              include: {
                category: true
              }
            }
          }
        })
      }
    }

    console.log('Cart item handled successfully')

    const response = {
      success: true,
      data: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        slug: cartItem.product.slug,
        price: Number(cartItem.product.price),
        comparePrice: cartItem.product.comparePrice ? Number(cartItem.product.comparePrice) : undefined,
        image: cartItem.product.images[0] || '',
        category: cartItem.product.category.slug,
        quantity: cartItem.quantity
      },
      message: 'Item added to cart'
    }
    
    console.log('=== POST /api/cart SUCCESS ===')
    return NextResponse.json(response)
  } catch (error) {
    console.error('=== POST /api/cart ERROR ===', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { productId, quantity, sessionId } = body

    if (!session && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { success: false, error: 'Product ID and quantity are required' },
        { status: 400 }
      )
    }

    // Find the cart item
    const existingCartItem = await prisma.cartItem.findFirst({
      where: session 
        ? { userId: session.user.id, productId }
        : { sessionId: sessionId!, productId }
    })

    if (!existingCartItem) {
      return NextResponse.json(
        { success: false, error: 'Cart item not found' },
        { status: 404 }
      )
    }

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      await prisma.cartItem.delete({
        where: { id: existingCartItem.id }
      })

      return NextResponse.json({
        success: true,
        message: 'Item removed from cart'
      })
    }

    // Update quantity
    const cartItem = await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity },
      include: {
        product: {
          include: {
            category: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: cartItem.product.id,
        name: cartItem.product.name,
        slug: cartItem.product.slug,
        price: Number(cartItem.product.price),
        comparePrice: cartItem.product.comparePrice ? Number(cartItem.product.comparePrice) : undefined,
        image: cartItem.product.images[0] || '',
        category: cartItem.product.category.slug,
        quantity: cartItem.quantity
      },
      message: 'Cart updated'
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from cart or clear cart
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const sessionId = searchParams.get('sessionId')
    const clearAll = searchParams.get('clearAll')

    if (!session && !sessionId) {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 401 }
      )
    }

    if (clearAll === 'true') {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: session 
          ? { userId: session.user.id }
          : { sessionId: sessionId! }
      })

      return NextResponse.json({
        success: true,
        message: 'Cart cleared'
      })
    }

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Find and remove specific item
    const existingCartItem = await prisma.cartItem.findFirst({
      where: session 
        ? { userId: session.user.id, productId }
        : { sessionId: sessionId!, productId }
    })

    if (existingCartItem) {
      await prisma.cartItem.delete({
        where: { id: existingCartItem.id }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart'
    })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove item from cart' },
      { status: 500 }
    )
  }
}