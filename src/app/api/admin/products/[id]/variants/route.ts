import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET all variants for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const variants = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: variants
    })
  } catch (error) {
    console.error('Error fetching variants:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch variants' },
      { status: 500 }
    )
  }
}

// POST create new variant
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { sku, name, attributes, price, comparePrice, images, inStock, stock } = body

    if (!sku || !name || !price) {
      return NextResponse.json(
        { success: false, error: 'SKU, name, and price are required' },
        { status: 400 }
      )
    }

    // Check if SKU already exists
    const existingSku = await prisma.productVariant.findUnique({
      where: { sku }
    })

    if (existingSku) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      )
    }

    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
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
      message: 'Variant created successfully'
    })
  } catch (error) {
    console.error('Error creating variant:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create variant' },
      { status: 500 }
    )
  }
}
