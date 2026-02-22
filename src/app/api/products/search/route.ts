import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Search products API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        success: false,
        error: 'Search query must be at least 2 characters'
      }, { status: 400 })
    }

    // Search products by name, description, or category
    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            category: {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            }
          },
          {
            category: {
              slug: {
                contains: query,
                mode: 'insensitive'
              }
            }
          }
        ]
      },
      include: {
        category: true
      },
      take: 10,
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    const formattedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name
    }))

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      count: formattedProducts.length
    })
  } catch (error) {
    console.error('Error searching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search products' },
      { status: 500 }
    )
  }
}
