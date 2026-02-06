import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all products with their images
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      take: 5 // Just get first 5 for debugging
    })

    // Check if products have images
    const productDetails = products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      imageCount: p.images.length,
      images: p.images,
      hasImages: p.images.length > 0,
      firstImage: p.images[0] || 'NO IMAGE'
    }))

    const summary = {
      totalProducts: await prisma.product.count(),
      totalCategories: await prisma.category.count(),
      productsWithImages: products.filter(p => p.images.length > 0).length,
      productsWithoutImages: products.filter(p => p.images.length === 0).length,
      sampleProducts: productDetails
    }

    return NextResponse.json({
      success: true,
      data: summary,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Debug products error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
