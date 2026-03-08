import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '8')
    const skip = (page - 1) * limit

    // Get total count for pagination
    const total = await prisma.product.count({
      where: {
        featured: true,
        inStock: true
      }
    })

    const products = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true
      },
      include: {
        category: true
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name,
      inStock: product.inStock,
      featured: product.featured
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total,
        hasMore: skip + products.length < total
      }
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      data: [],
      pagination: { page: 1, limit: 8, total: 0, hasMore: false }
    }, { status: 500 })
  }
}
