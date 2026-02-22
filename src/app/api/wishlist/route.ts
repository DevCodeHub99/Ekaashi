import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch wishlist items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = request.cookies.get('sessionId')?.value

    let wishlistItems

    if (session?.user?.email) {
      // Fetch for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      wishlistItems = await prisma.wishlistItem.findMany({
        where: { userId: user.id },
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (sessionId) {
      // Fetch for guest user
      wishlistItems = await prisma.wishlistItem.findMany({
        where: { sessionId },
        include: {
          product: {
            include: {
              category: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      return NextResponse.json({ success: true, data: [] })
    }

    return NextResponse.json({ success: true, data: wishlistItems })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { productId } = body

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    let sessionId = request.cookies.get('sessionId')?.value

    // Generate session ID for guest users
    if (!session?.user?.email && !sessionId) {
      sessionId = `guest_${Math.random().toString(36).substring(2)}_${Date.now()}`
    }

    let wishlistItem

    if (session?.user?.email) {
      // Add for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      // Check if already in wishlist
      const existing = await prisma.wishlistItem.findFirst({
        where: {
          userId: user.id,
          productId
        }
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Product already in wishlist' },
          { status: 400 }
        )
      }

      wishlistItem = await prisma.wishlistItem.create({
        data: {
          userId: user.id,
          productId
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
      // Add for guest user
      const existing = await prisma.wishlistItem.findFirst({
        where: {
          sessionId,
          productId
        }
      })

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Product already in wishlist' },
          { status: 400 }
        )
      }

      wishlistItem = await prisma.wishlistItem.create({
        data: {
          sessionId,
          productId
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

    const response = NextResponse.json({ success: true, data: wishlistItem })

    // Set session cookie for guest users
    if (!session?.user?.email && sessionId) {
      response.cookies.set('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30 // 30 days
      })
    }

    return response
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const sessionId = request.cookies.get('sessionId')?.value

    if (session?.user?.email) {
      // Remove for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      await prisma.wishlistItem.deleteMany({
        where: {
          userId: user.id,
          productId
        }
      })
    } else if (sessionId) {
      // Remove for guest user
      await prisma.wishlistItem.deleteMany({
        where: {
          sessionId,
          productId
        }
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, message: 'Item removed from wishlist' })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
