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

    console.log('GET wishlist - Session:', !!session, 'SessionId:', sessionId)

    let wishlistItems

    if (session?.user?.email) {
      // Fetch for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      console.log('Fetching wishlist for user:', user.id)
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
      console.log('Found', wishlistItems.length, 'items for user')
    } else if (sessionId) {
      // Fetch for guest user
      console.log('Fetching wishlist for guest sessionId:', sessionId)
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
      console.log('Found', wishlistItems.length, 'items for guest')
    } else {
      console.log('No session or sessionId found, returning empty array')
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

    console.log('DELETE wishlist - productId:', productId)

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const sessionId = request.cookies.get('sessionId')?.value
    console.log('Session:', !!session, 'SessionId:', sessionId)

    let deletedCount = 0

    if (session?.user?.email) {
      // Remove for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
      }

      console.log('Deleting for user:', user.id)
      const result = await prisma.wishlistItem.deleteMany({
        where: {
          userId: user.id,
          productId
        }
      })
      deletedCount = result.count
      console.log('Deleted count:', deletedCount)
    } else if (sessionId) {
      // Remove for guest user
      console.log('Deleting for guest sessionId:', sessionId)
      const result = await prisma.wishlistItem.deleteMany({
        where: {
          sessionId,
          productId
        }
      })
      deletedCount = result.count
      console.log('Deleted count:', deletedCount)
    } else {
      return NextResponse.json(
        { success: false, error: 'No session found' },
        { status: 400 }
      )
    }

    if (deletedCount === 0) {
      console.log('No items were deleted - item may not exist')
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Item removed from wishlist',
      deletedCount 
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
