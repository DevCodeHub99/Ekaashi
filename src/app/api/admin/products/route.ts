import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { withRateLimit, apiRateLimit } from '@/lib/rate-limit'
import { withErrorHandler, successResponse, APIError } from '@/lib/api-handler'
import { productSchema } from '@/lib/validations'

// GET - Fetch all products
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    if (status && status !== 'all') {
      if (status === 'in-stock') {
        where.inStock = true
      } else if (status === 'out-of-stock') {
        where.inStock = false
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform products to match expected format
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name,
      inStock: product.inStock,
      featured: product.featured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      total: transformedProducts.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export const POST = withRateLimit(apiRateLimit, withErrorHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    throw new APIError('Unauthorized', 401)
  }

  const body = await request.json()
  
  // Validate with Zod schema
  const validated = productSchema.parse(body)
  
  // Check if SKU already exists (if provided)
  if (body.sku) {
    const existingSku = await prisma.product.findUnique({
      where: { sku: body.sku }
    })

    if (existingSku) {
      throw new APIError('SKU already exists', 400)
    }
  }

  // Generate slug
  const slug = validated.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  // Create product in database
  const newProduct = await prisma.product.create({
    data: {
      name: validated.name,
      slug: slug,
      sku: body.sku || `SKU-${Date.now()}`,
      description: validated.description,
      specifications: body.specifications || null,
      careInstructions: body.careInstructions || null,
      price: validated.price,
      comparePrice: validated.comparePrice || null,
      images: validated.images,
      color: body.color || null,
      size: body.size || null,
      material: body.material || null,
      categoryId: validated.categoryId,
      inStock: validated.inStock,
      featured: validated.featured,
      seoTitle: body.seoTitle || validated.name,
      seoDescription: body.seoDescription || validated.description
    },
    include: {
      category: true
    }
  })

  // Transform response
  const transformedProduct = {
    id: newProduct.id,
    name: newProduct.name,
    slug: newProduct.slug,
    sku: newProduct.sku,
    description: newProduct.description,
    price: Number(newProduct.price),
    comparePrice: newProduct.comparePrice ? Number(newProduct.comparePrice) : undefined,
    images: newProduct.images,
    category: newProduct.category.slug,
    categoryName: newProduct.category.name,
    inStock: newProduct.inStock,
    featured: newProduct.featured,
    createdAt: newProduct.createdAt,
    updatedAt: newProduct.updatedAt
  }

  return successResponse(transformedProduct, 201)
}))