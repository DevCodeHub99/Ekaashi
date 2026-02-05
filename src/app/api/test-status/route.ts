import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    // Test basic connectivity
    let results = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasUrl: !!databaseUrl,
      urlType: databaseUrl ? (databaseUrl.startsWith('mongodb') ? 'mongodb' : 'other') : 'none',
      urlPrefix: databaseUrl ? databaseUrl.substring(0, 60) + '...' : 'none',
      prismaTest: 'not tested',
      mongoTest: 'not tested'
    }

    // Test Prisma
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      const userCount = await prisma.user.count()
      results.prismaTest = `success - ${userCount} users found`
      await prisma.$disconnect()
    } catch (error) {
      results.prismaTest = `error: ${error instanceof Error ? error.message.substring(0, 100) : String(error).substring(0, 100)}`
    }

    // Test direct MongoDB connection
    try {
      if (databaseUrl && databaseUrl.startsWith('mongodb')) {
        const { MongoClient } = await import('mongodb')
        const client = new MongoClient(databaseUrl)
        await client.connect()
        await client.db().admin().ping()
        await client.close()
        results.mongoTest = 'success - direct connection works'
      } else {
        results.mongoTest = 'skipped - not mongodb url'
      }
    } catch (error) {
      results.mongoTest = `error: ${error instanceof Error ? error.message.substring(0, 100) : String(error).substring(0, 100)}`
    }

    // Return as HTML for easy viewing
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Status Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .status { padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 5px solid; }
            .success { background-color: #d4edda; color: #155724; border-color: #28a745; }
            .error { background-color: #f8d7da; color: #721c24; border-color: #dc3545; }
            .warning { background-color: #fff3cd; color: #856404; border-color: #ffc107; }
            .info { background-color: #d1ecf1; color: #0c5460; border-color: #17a2b8; }
            pre { background: #f8f9fa; padding: 10px; border-radius: 5px; overflow-x: auto; }
            h1 { color: #333; margin-bottom: 30px; }
            h2 { color: #666; margin-top: 30px; margin-bottom: 15px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Database Connection Status</h1>
            
            <div class="status info">
                <strong>Timestamp:</strong> ${results.timestamp}
            </div>
            
            <div class="status info">
                <strong>Environment:</strong> ${results.environment}
            </div>
            
            <div class="status ${results.hasUrl ? 'success' : 'error'}">
                <strong>Has DATABASE_URL:</strong> ${results.hasUrl ? '✅ Yes' : '❌ No'}
            </div>
            
            <div class="status ${results.urlType === 'mongodb' ? 'success' : 'error'}">
                <strong>URL Type:</strong> ${results.urlType === 'mongodb' ? '✅ MongoDB' : '❌ ' + results.urlType}
            </div>
            
            <div class="status info">
                <strong>URL Preview:</strong><br>
                <code>${results.urlPrefix}</code>
            </div>
            
            <h2>🧪 Connection Tests</h2>
            
            <div class="status ${results.prismaTest.includes('success') ? 'success' : 'error'}">
                <strong>Prisma Test:</strong><br>
                ${results.prismaTest}
            </div>
            
            <div class="status ${results.mongoTest.includes('success') ? 'success' : 'error'}">
                <strong>Direct MongoDB Test:</strong><br>
                ${results.mongoTest}
            </div>
            
            <h2>🎯 Diagnosis</h2>
            
            ${results.prismaTest.includes('success') ? 
                '<div class="status success">✅ <strong>GOOD:</strong> Database connection is working! You can now seed the database.</div>' :
                '<div class="status error">❌ <strong>PROBLEM:</strong> Database connection failed. Check the error messages above.</div>'
            }
            
            <h2>🚀 Next Steps</h2>
            
            ${results.prismaTest.includes('success') ? 
                `<div class="status success">
                    <strong>Ready to seed!</strong> Run this in your browser console:<br><br>
                    <pre>fetch('/api/seed-mongodb', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
})
.then(response => response.json())
.then(data => console.log('SUCCESS:', data))
.catch(error => console.error('ERROR:', error))</pre>
                </div>` :
                `<div class="status error">
                    <strong>Fix database connection first:</strong><br>
                    1. Check DATABASE_URL in Vercel dashboard<br>
                    2. Ensure it starts with mongodb+srv://<br>
                    3. Redeploy the application
                </div>`
            }
        </div>
    </body>
    </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head><title>Error</title></head>
    <body style="font-family: Arial, sans-serif; margin: 40px;">
        <h1>❌ Critical Error</h1>
        <p><strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}</p>
        <p><strong>This suggests a serious deployment issue.</strong></p>
    </body>
    </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
}