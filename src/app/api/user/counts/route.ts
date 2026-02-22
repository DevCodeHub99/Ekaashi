import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch cart and wishlist counts in a single request
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const sessionId = request.cookies.get('sessionId')?.value

    let cartCount = 0
    let wishlistCount = 0

    if (session?.user?.email) {
      // Fetch for logged-in user
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
          _count: {
            select: {
              cartItems: true,
              wishlistItems: true
            }
          }
        }
      })

      if (user) {
        cartCount = user._count.cartItems
        wishlistCount = user._count.wishlistItems
      }
    } else if (sessionId) {
      // Fetch for guest user
      const [cart, wishlist] = await Promise.all([
        prisma.cartItem.count({ where: { sessionId } }),
        prisma.wishlistItem.count({ where: { sessionId } })
      ])
      
      cartCount = cart
      wishlistCount = wishlist
    }

    return NextResponse.json({
      success: true,
      data: {
        cart: cartCount,
        wishlist: wishlistCount
      }
    })
  } catch (error) {
    console.error('Error fetching counts:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch counts',
        data: { cart: 0, wishlist: 0 }
      },
      { status: 500 }
    )
  }
}
