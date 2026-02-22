import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - Fetch all Instagram posts
export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: 'asc' }
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

// POST - Create new Instagram post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, caption, link, isActive, order } = body

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      )
    }

    const post = await prisma.instagramPost.create({
      data: {
        image,
        caption: caption || null,
        link: link || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error creating Instagram post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create Instagram post' },
      { status: 500 }
    )
  }
}
