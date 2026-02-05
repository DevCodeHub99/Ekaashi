import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting MongoDB database seeding...')

    // Test connection
    await prisma.$connect()
    console.log('MongoDB connected successfully')

    // Create admin user
    const bcrypt = await import('bcryptjs')
    const adminPassword = await bcrypt.hash('admin123', 12)

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ekaashi.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@ekaashi.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    })
    console.log('Admin user created:', adminUser.id)

    // Create categories
    const categories = [
      { name: 'Party Wear Earrings', slug: 'party-wear-earrings', description: 'Elegant earrings for special occasions' },
      { name: 'Ethnic Earrings', slug: 'ethnic-earrings', description: 'Traditional and cultural earring designs' },
      { name: 'Casual Earrings', slug: 'casual-earrings', description: 'Everyday wear earrings' },
      { name: 'Casual Necklace', slug: 'casual-necklace', description: 'Stylish necklaces for daily wear' },
      { name: 'Jewelry Set', slug: 'jewelry-set', description: 'Complete jewelry sets' }
    ]

    const createdCategories = []
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat
      })
      createdCategories.push(category)
      console.log('Category created:', category.name)
    }

    // Create products
    const products = [
      {
        name: 'Golden Elegance Earrings',
        slug: 'golden-elegance-earrings',
        description: 'Beautiful golden earrings perfect for special occasions and parties',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Golden Elegance Earrings - Party Wear Jewelry',
        seoDescription: 'Stunning golden earrings perfect for parties and special occasions'
      },
      {
        name: 'Silver Pearl Necklace',
        slug: 'silver-pearl-necklace',
        description: 'Elegant silver necklace with beautiful pearls for a sophisticated look',
        price: 4999,
        comparePrice: 6999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: true,
        inStock: true,
        seoTitle: 'Silver Pearl Necklace - Elegant Jewelry',
        seoDescription: 'Beautiful silver necklace with pearls for elegant occasions'
      },
      {
        name: 'Traditional Jhumka Earrings',
        slug: 'traditional-jhumka-earrings',
        description: 'Classic Indian jhumka earrings with intricate designs',
        price: 1999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: false,
        inStock: true,
        seoTitle: 'Traditional Jhumka Earrings - Ethnic Jewelry',
        seoDescription: 'Authentic traditional jhumka earrings with beautiful craftsmanship'
      },
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        description: 'Simple yet elegant diamond stud earrings for everyday wear',
        price: 3499,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: true,
        inStock: true,
        seoTitle: 'Diamond Stud Earrings - Casual Jewelry',
        seoDescription: 'Elegant diamond stud earrings perfect for daily wear'
      },
      {
        name: 'Bridal Jewelry Set',
        slug: 'bridal-jewelry-set',
        description: 'Complete bridal jewelry set with necklace, earrings, and maang tikka',
        price: 15999,
        comparePrice: 19999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: true,
        inStock: true,
        seoTitle: 'Bridal Jewelry Set - Complete Wedding Collection',
        seoDescription: 'Stunning bridal jewelry set perfect for weddings and special occasions'
      }
    ]

    for (const product of products) {
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      })
      console.log('Product created:', createdProduct.name)
    }

    // Create banners
    const banners = [
      {
        title: 'Welcome to Ekaashi',
        subtitle: 'Discover Exquisite Jewelry Collection',
        description: 'Handcrafted jewelry pieces that celebrate your unique style',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
        isActive: true,
        order: 1
      },
      {
        title: 'New Arrivals',
        subtitle: 'Latest Jewelry Trends',
        description: 'Explore our newest collection of stunning jewelry pieces',
        buttonText: 'View Collection',
        buttonLink: '/new-arrivals',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
        isActive: true,
        order: 2
      }
    ]

    for (const banner of banners) {
      const createdBanner = await prisma.banner.create({
        data: banner
      })
      console.log('Banner created:', createdBanner.title)
    }

    await prisma.$disconnect()

    const counts = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      banners: await prisma.banner.count()
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB database seeded successfully',
      counts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('MongoDB seeding failed:', error)
    
    return NextResponse.json({
      error: 'MongoDB seeding failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}