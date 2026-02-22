import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch active Instagram posts for public display
export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      take: 6 // Limit to 6 posts for display
    })

    return NextResponse.json({
      success: true,
      data: posts
    })
  } catch (error) {
    console.error('Error fetching Instagram posts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    )
  }
}
