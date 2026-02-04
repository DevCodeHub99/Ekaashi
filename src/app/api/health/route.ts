import { NextRequest, NextResponse } from 'next/server'
import { getHealthStatus } from '@/lib/monitoring'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Basic health status
    const health = getHealthStatus()

    // Test database connection
    let dbStatus = 'healthy'
    let dbLatency = 0
    
    try {
      const start = Date.now()
      await prisma.$queryRaw`SELECT 1`
      dbLatency = Date.now() - start
    } catch (error) {
      dbStatus = 'unhealthy'
      console.error('Database health check failed:', error)
    }

    // Check environment variables
    const envCheck = {
      database: !!process.env.DATABASE_URL,
      nextauth: !!process.env.NEXTAUTH_SECRET,
      cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME
    }

    const allEnvVarsPresent = Object.values(envCheck).every(Boolean)

    const response = {
      ...health,
      database: {
        status: dbStatus,
        latency: dbLatency
      },
      environment: {
        status: allEnvVarsPresent ? 'healthy' : 'warning',
        variables: envCheck
      },
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version
    }

    // Determine overall status
    const overallStatus = dbStatus === 'healthy' && allEnvVarsPresent ? 'healthy' : 'degraded'

    return NextResponse.json({
      ...response,
      status: overallStatus
    }, {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}