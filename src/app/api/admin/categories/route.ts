import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

// GET all categories (with subcategories)
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Filter top-level categories in JavaScript instead of in the query
    const topLevelCategories = categories.filter(cat => !cat.parentId)

    return NextResponse.json({
      success: true,
      data: topLevelCategories
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST create new category or subcategory
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, image, parentId, isActive, order } = body

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      )
    }

    const slug = slugify(name)

    // Check if slug already exists
    const existing = await prisma.category.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Category with this name already exists' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        image,
        parentId: parentId || null,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0
      },
      include: {
        subcategories: true,
        _count: {
          select: { products: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
