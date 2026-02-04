import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const dbUrl = process.env.DATABASE_URL
    const hasDbUrl = !!dbUrl
    const dbUrlStart = dbUrl ? dbUrl.substring(0, 30) + '...' : 'missing'

    // Try to import Prisma
    let prismaImported = false
    let connectionTest = 'not_attempted'
    let errorDetails = ''

    try {
      const { PrismaClient } = await import('@prisma/client')
      prismaImported = true
      
      const prisma = new PrismaClient()
      
      try {
        // Test connection with timeout
        const testQuery = await Promise.race([
          prisma.$queryRaw`SELECT 1 as test`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout after 5s')), 5000)
          )
        ])
        
        connectionTest = 'success'
        await prisma.$disconnect()
        
      } catch (dbError) {
        connectionTest = 'failed'
        errorDetails = dbError instanceof Error ? dbError.message : String(dbError)
        await prisma.$disconnect()
      }
      
    } catch (importError) {
      errorDetails = importError instanceof Error ? importError.message : String(importError)
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL_REGION: process.env.VERCEL_REGION || 'unknown'
      },
      database: {
        url_present: hasDbUrl,
        url_preview: dbUrlStart,
        prisma_imported: prismaImported,
        connection_test: connectionTest,
        error_details: errorDetails
      }
    })

  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}