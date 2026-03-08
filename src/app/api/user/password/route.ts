import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { withRateLimit, passwordRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, successResponse, APIError } from '@/lib/api-handler'
import { changePasswordSchema } from '@/lib/validations'

// PUT - Update user password
export const PUT = withRateLimit(passwordRateLimit, withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new APIError('Authentication required', 401)
  }

  const body = await request.json()
  const validated = changePasswordSchema.parse(body)

  if (validated.currentPassword === validated.newPassword) {
    throw new APIError('New password must be different from current password', 400)
  }

  // Get user with current password
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      password: true
    }
  })

  if (!user || !user.password) {
    throw new APIError('User not found or password not set', 404)
  }

  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(validated.currentPassword, user.password)
  if (!isCurrentPasswordValid) {
    throw new APIError('Current password is incorrect', 400)
  }

  // Hash new password
  const hashedNewPassword = await bcrypt.hash(validated.newPassword, 12)

  // Update password
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      password: hashedNewPassword
    }
  })

  return successResponse({ message: 'Password updated successfully' })
}))