import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // First check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        error: 'DATABASE_URL not found',
        env_vars: {
          DATABASE_URL: 'missing',
          NODE_ENV: process.env.NODE_ENV
        }
      }, { status: 500 })
    }

    // Try to import and use Prisma
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Test basic connection
      await prisma.$connect()
      
      // Try a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test`
      
      // Try to count products
      const productCount = await prisma.product.count()
      
      await prisma.$disconnect()

      return NextResponse.json({
        status: 'success',
        database: 'connected',
        test_query: result,
        product_count: productCount,
        timestamp: new Date().toISOString()
      })

    } catch (dbError) {
      await prisma.$disconnect()
      return NextResponse.json({
        error: 'Database connection failed',
        details: dbError instanceof Error ? dbError.message : String(dbError),
        database_url_present: !!process.env.DATABASE_URL,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test database',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}