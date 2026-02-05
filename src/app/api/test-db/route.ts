import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test environment variables
    const databaseUrl = process.env.DATABASE_URL
    
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'error',
        error: 'DATABASE_URL not found',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    if (!databaseUrl.startsWith('mongodb')) {
      return NextResponse.json({
        status: 'error',
        error: 'DATABASE_URL is not a MongoDB URL',
        databaseUrl: databaseUrl.substring(0, 30) + '...',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test Prisma client
    let prismaTest = 'not tested'
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      prismaTest = 'connected'
      
      // Try a simple query
      const userCount = await prisma.user.count()
      prismaTest = `connected, ${userCount} users`
      
      await prisma.$disconnect()
    } catch (error) {
      prismaTest = `error: ${error instanceof Error ? error.message : String(error)}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        url: databaseUrl.substring(0, 50) + '...',
        type: 'mongodb',
        prismaTest
      }
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}