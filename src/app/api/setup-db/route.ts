import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // Check if we can connect to the database
    await prisma.$connect()
    
    // Check if tables exist by counting users
    let tablesExist = false
    try {
      await prisma.user.count()
      tablesExist = true
    } catch (error) {
      tablesExist = false
    }

    if (!tablesExist) {
      return NextResponse.json({
        error: 'Database tables do not exist',
        message: 'Please run database migrations first',
        suggestion: 'Run: npx prisma db push'
      }, { status: 500 })
    }

    // Check if we have products
    const productCount = await prisma.product.count()
    const userCount = await prisma.user.count()
    const bannerCount = await prisma.banner.count()

    // If no products, create some sample data
    if (productCount === 0) {
      // Create admin user if doesn't exist
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@ekaashi.com'
      const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail }
      })

      if (!existingAdmin) {
        const bcrypt = await import('bcryptjs')
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12)
        
        await prisma.user.create({
          data: {
            email: adminEmail,
            password: hashedPassword,
            name: 'Admin',
            role: 'ADMIN'
          }
        })
      }

      // Create sample products
      const sampleProducts = [
        {
          name: 'Golden Elegance Earrings',
          slug: 'golden-elegance-earrings',
          description: 'Beautiful golden earrings perfect for special occasions',
          price: 2999,
          images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'],
          isActive: true,
          isFeatured: true,
          stock: 10,
          category: {
            connectOrCreate: {
              where: { slug: 'party-wear-earrings' },
              create: { name: 'Party Wear Earrings', slug: 'party-wear-earrings' }
            }
          }
        },
        {
          name: 'Silver Pearl Necklace',
          slug: 'silver-pearl-necklace',
          description: 'Elegant silver necklace with pearls',
          price: 4999,
          images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
          isActive: true,
          isFeatured: true,
          stock: 5,
          category: {
            connectOrCreate: {
              where: { slug: 'casual-necklace' },
              create: { name: 'Casual Necklace', slug: 'casual-necklace' }
            }
          }
        }
      ]

      for (const product of sampleProducts) {
        await prisma.product.create({ data: product })
      }

      // Create sample banner
      await prisma.banner.create({
        data: {
          title: 'Welcome to Ekaashi',
          subtitle: 'Discover Beautiful Jewelry',
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
          isActive: true,
          order: 1
        }
      })
    }

    const finalCounts = {
      products: await prisma.product.count(),
      users: await prisma.user.count(),
      banners: await prisma.banner.count()
    }

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database setup completed',
      counts: finalCounts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    await prisma.$disconnect()
    
    return NextResponse.json({
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}