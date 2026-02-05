import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Import Prisma
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    console.log('Starting database schema creation...')

    // Test connection first
    await prisma.$connect()
    console.log('Database connected successfully')

    // Create tables using raw SQL (since Prisma might not work without schema)
    const createTablesSQL = `
      -- Create User table
      CREATE TABLE IF NOT EXISTS "User" (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        role TEXT DEFAULT 'USER',
        "emailVerified" TIMESTAMP,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Category table
      CREATE TABLE IF NOT EXISTS "Category" (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Product table
      CREATE TABLE IF NOT EXISTS "Product" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        "originalPrice" INTEGER,
        images TEXT[] DEFAULT '{}',
        "categoryId" TEXT,
        "isActive" BOOLEAN DEFAULT true,
        "isFeatured" BOOLEAN DEFAULT false,
        "isOnSale" BOOLEAN DEFAULT false,
        stock INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category"(id)
      );

      -- Create Banner table
      CREATE TABLE IF NOT EXISTS "Banner" (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        description TEXT,
        "buttonText" TEXT,
        "buttonLink" TEXT,
        image TEXT NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create Order table
      CREATE TABLE IF NOT EXISTS "Order" (
        id TEXT PRIMARY KEY,
        "userId" TEXT,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        "postalCode" TEXT NOT NULL,
        "totalPrice" INTEGER NOT NULL,
        status TEXT DEFAULT 'PENDING',
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("userId") REFERENCES "User"(id)
      );

      -- Create OrderItem table
      CREATE TABLE IF NOT EXISTS "OrderItem" (
        id TEXT PRIMARY KEY,
        "orderId" TEXT NOT NULL,
        "productId" TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price INTEGER NOT NULL,
        FOREIGN KEY ("orderId") REFERENCES "Order"(id),
        FOREIGN KEY ("productId") REFERENCES "Product"(id)
      );
    `

    // Execute the SQL
    await prisma.$executeRawUnsafe(createTablesSQL)
    console.log('Database schema created successfully')

    // Now create some sample data
    const bcrypt = await import('bcryptjs')
    const adminPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    await prisma.$executeRawUnsafe(`
      INSERT INTO "User" (id, name, email, password, role, "createdAt", "updatedAt")
      VALUES ('admin-user-id', 'Admin', 'admin@ekaashi.com', '${adminPassword}', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (email) DO NOTHING
    `)

    // Create categories
    const categories = [
      { id: 'cat-1', name: 'Party Wear Earrings', slug: 'party-wear-earrings' },
      { id: 'cat-2', name: 'Ethnic Earrings', slug: 'ethnic-earrings' },
      { id: 'cat-3', name: 'Casual Earrings', slug: 'casual-earrings' },
      { id: 'cat-4', name: 'Casual Necklace', slug: 'casual-necklace' },
      { id: 'cat-5', name: 'Jewelry Set', slug: 'jewelry-set' }
    ]

    for (const cat of categories) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Category" (id, name, slug, "createdAt", "updatedAt")
        VALUES ('${cat.id}', '${cat.name}', '${cat.slug}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (slug) DO NOTHING
      `)
    }

    // Create sample products
    const products = [
      {
        id: 'prod-1',
        name: 'Golden Elegance Earrings',
        slug: 'golden-elegance-earrings',
        description: 'Beautiful golden earrings perfect for special occasions',
        price: 2999,
        categoryId: 'cat-1',
        images: '{"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500"}',
        isFeatured: true
      },
      {
        id: 'prod-2',
        name: 'Silver Pearl Necklace',
        slug: 'silver-pearl-necklace',
        description: 'Elegant silver necklace with pearls',
        price: 4999,
        categoryId: 'cat-4',
        images: '{"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500"}',
        isFeatured: true
      }
    ]

    for (const product of products) {
      await prisma.$executeRawUnsafe(`
        INSERT INTO "Product" (id, name, slug, description, price, "categoryId", images, "isActive", "isFeatured", stock, "createdAt", "updatedAt")
        VALUES ('${product.id}', '${product.name}', '${product.slug}', '${product.description}', ${product.price}, '${product.categoryId}', '${product.images}', true, ${product.isFeatured}, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT (slug) DO NOTHING
      `)
    }

    // Create sample banner
    await prisma.$executeRawUnsafe(`
      INSERT INTO "Banner" (id, title, subtitle, image, "isActive", "order", "createdAt", "updatedAt")
      VALUES ('banner-1', 'Welcome to Ekaashi', 'Discover Beautiful Jewelry', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING
    `)

    await prisma.$disconnect()

    return NextResponse.json({
      success: true,
      message: 'Database schema and sample data created successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Database setup failed:', error)
    
    return NextResponse.json({
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}