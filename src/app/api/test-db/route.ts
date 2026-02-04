import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables first
    const envVars = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
      NODE_ENV: process.env.NODE_ENV
    }

    // Try to import Prisma
    let prismaStatus = 'not_imported'
    let dbTest = 'not_tested'
    
    try {
      const { prisma } = await import('@/lib/prisma')
      prismaStatus = 'imported'
      
      // Try a simple query
      await prisma.$queryRaw`SELECT 1 as test`
      dbTest = 'success'
    } catch (error) {
      dbTest = `error: ${error instanceof Error ? error.message : String(error)}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envVars,
      prisma: prismaStatus,
      database: dbTest,
      vercel: {
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
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