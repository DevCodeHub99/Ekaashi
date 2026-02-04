import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check environment variables
    const dbUrl = process.env.DATABASE_URL
    
    if (!dbUrl) {
      return NextResponse.json({
        error: 'DATABASE_URL not found',
        env_check: {
          DATABASE_URL: 'missing',
          NODE_ENV: process.env.NODE_ENV,
          VERCEL_REGION: process.env.VERCEL_REGION
        }
      }, { status: 500 })
    }
    
    // Parse the database URL
    const urlParts = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)
    
    if (!urlParts) {
      return NextResponse.json({
        error: 'Invalid DATABASE_URL format',
        url_preview: dbUrl.substring(0, 50) + '...',
        expected_format: 'postgresql://user:password@host:port/database'
      }, { status: 500 })
    }
    
    const [, user, password, host, port, database] = urlParts
    
    // Test if we can at least resolve the host
    try {
      const dns = await import('dns')
      const { promisify } = await import('util')
      const lookup = promisify(dns.lookup)
      
      const address = await lookup(host)
      
      return NextResponse.json({
        status: 'partial_success',
        message: 'Database host is reachable',
        connection_details: {
          host,
          port,
          database: database.split('?')[0],
          user,
          resolved_ip: address.address
        },
        url_preview: dbUrl.substring(0, 50) + '...',
        timestamp: new Date().toISOString()
      })
      
    } catch (dnsError) {
      return NextResponse.json({
        error: 'Cannot resolve database host',
        details: dnsError instanceof Error ? dnsError.message : String(dnsError),
        connection_details: {
          host,
          port,
          database: database.split('?')[0],
          user
        },
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }
    
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}