import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        comparePrice: {
          not: null
        },
        inStock: true
      },
      include: {
        category: true
      },
      take: 4,
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
      data: transformedProducts
    })
  } catch (error) {
    console.error('Error fetching deals:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch products',
      data: []
    }, { status: 500 })
  }
}
