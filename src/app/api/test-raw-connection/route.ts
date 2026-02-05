import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Test basic environment
    const databaseUrl = process.env.DATABASE_URL
    const nodeEnv = process.env.NODE_ENV
    
    // Test MongoDB connection without Prisma
    let mongoTest = 'not tested'
    try {
      if (databaseUrl && databaseUrl.startsWith('mongodb')) {
        // Try to create a basic MongoDB connection
        const { MongoClient } = await import('mongodb')
        const client = new MongoClient(databaseUrl)
        await client.connect()
        await client.db().admin().ping()
        await client.close()
        mongoTest = 'success'
      } else {
        mongoTest = 'invalid url'
      }
    } catch (error) {
      mongoTest = `error: ${error instanceof Error ? error.message : String(error)}`
    }

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: nodeEnv,
      database: {
        hasUrl: !!databaseUrl,
        urlType: databaseUrl ? (databaseUrl.startsWith('mongodb') ? 'mongodb' : 'other') : 'none',
        urlPrefix: databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'none',
        mongoTest
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