import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test basic connection first
    console.log('Testing database connection...')
    
    // Try to connect
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test a simple query
    const testResult = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Test query successful:', testResult)
    
    // Check if tables exist
    let tablesExist = false
    try {
      const userCount = await prisma.user.count()
      tablesExist = true
      console.log('Tables exist, user count:', userCount)
    } catch (error) {
      console.log('Tables do not exist:', error)
      tablesExist = false
    }
    
    // If tables don't exist, we need to run migrations
    if (!tablesExist) {
      return NextResponse.json({
        status: 'error',
        message: 'Database tables do not exist',
        suggestion: 'Database schema needs to be created',
        connection: 'successful',
        testQuery: testResult
      }, { status: 500 })
    }
    
    // Check data
    const counts = {
      users: await prisma.user.count(),
      products: await prisma.product.count(),
      categories: await prisma.category.count(),
      banners: await prisma.banner.count()
    }
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection and schema working',
      connection: 'successful',
      testQuery: testResult,
      counts,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Database initialization failed:', error)
    
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}