import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withRateLimit, profileRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, successResponse, APIError } from '@/lib/api-handler'
import { updateProfileSchema } from '@/lib/validations'

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: user
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export const PUT = withRateLimit(profileRateLimit, withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new APIError('Authentication required', 401)
  }

  const body = await request.json()
  const validated = updateProfileSchema.parse(body)

  // Check if email is already taken by another user
  if (validated.email !== session.user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    })

    if (existingUser && existingUser.id !== session.user.id) {
      throw new APIError('Email address is already in use', 400)
    }
  }

  // Update user profile
  const updatedUser = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: validated.name.trim(),
      email: validated.email.trim().toLowerCase()
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true
        }
      }
    }
  })

  return successResponse(updatedUser)
}))