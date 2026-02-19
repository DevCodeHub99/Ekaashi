import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT update variant
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { variantId } = await params
    const body = await request.json()
    const { sku, name, attributes, price, comparePrice, images, inStock, stock } = body

    if (!sku || !name || !price) {
      return NextResponse.json(
        { success: false, error: 'SKU, name, and price are required' },
        { status: 400 }
      )
    }

    // Check if SKU already exists (excluding current variant)
    const existingSku = await prisma.productVariant.findFirst({
      where: {
        sku,
        id: { not: variantId }
      }
    })

    if (existingSku) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      )
    }

    const variant = await prisma.productVariant.update({
      where: { id: variantId },
      data: {
        sku,
        name,
        attributes: attributes || {},
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        images: images || [],
        inStock: inStock !== false,
        stock: stock || 0
      }
    })

    return NextResponse.json({
      success: true,
      data: variant,
      message: 'Variant updated successfully'
    })
  } catch (error) {
    console.error('Error updating variant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update variant' },
      { status: 500 }
    )
  }
}

// DELETE variant
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { variantId } = await params
    
    await prisma.productVariant.delete({
      where: { id: variantId }
    })

    return NextResponse.json({
      success: true,
      message: 'Variant deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting variant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete variant' },
      { status: 500 }
    )
  }
}
