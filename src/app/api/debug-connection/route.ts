import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    return NextResponse.json({
      success: true,
      hasUrl: !!databaseUrl,
      urlPrefix: databaseUrl ? databaseUrl.substring(0, 20) + '...' : 'No URL',
      isMongoUrl: databaseUrl ? databaseUrl.startsWith('mongodb') : false,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}