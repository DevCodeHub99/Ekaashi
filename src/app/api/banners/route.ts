import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch active banners for public display
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json({
      success: true,
      data: banners
    })
  } catch (error) {
    console.error('Error fetching public banners:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch banners' },
      { status: 500 }
    )
  }
}