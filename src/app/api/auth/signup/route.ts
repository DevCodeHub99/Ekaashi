import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { withRateLimit, authRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, successResponse } from '@/lib/api-handler'
import { signUpSchema } from '@/lib/validations'

export const POST = withRateLimit(authRateLimit, withErrorHandler(async (request: NextRequest) => {
    const body = await request.json()
    const validated = signUpSchema.parse(body)
    const { name, email, password } = validated

    console.log('Signup attempt:', { name, email })

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CUSTOMER"
      }
    })

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return successResponse(userWithoutPassword, 201)
  })
)