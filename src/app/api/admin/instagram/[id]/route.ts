import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// PUT - Update Instagram post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { image, caption, link, isActive, order } = body

    const post = await prisma.instagramPost.update({
      where: { id: params.id },
      data: {
        image,
        caption: caption || null,
        link: link || null,
        isActive,
        order
      }
    })

    return NextResponse.json({
      success: true,
      data: post
    })
  } catch (error) {
    console.error('Error updating Instagram post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update Instagram post' },
      { status: 500 }
    )
  }
}

// DELETE - Delete Instagram post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.instagramPost.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting Instagram post:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete Instagram post' },
      { status: 500 }
    )
  }
}
