import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const envCheck = {
      DATABASE_URL: !!process.env.DATABASE_URL ? 'present' : 'missing',
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET ? 'present' : 'missing',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'missing',
      CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME ? 'present' : 'missing',
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_REGION: process.env.VERCEL_REGION || 'unknown',
      VERCEL_URL: process.env.VERCEL_URL || 'unknown'
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: envCheck
    })

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}