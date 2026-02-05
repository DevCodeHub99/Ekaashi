import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    const result = {
      hasUrl: !!databaseUrl,
      urlPrefix: databaseUrl ? databaseUrl.substring(0, 30) + '...' : 'No URL found',
      isMongoUrl: databaseUrl ? databaseUrl.startsWith('mongodb') : false,
      isPostgresUrl: databaseUrl ? databaseUrl.startsWith('postgresql') : false,
      timestamp: new Date().toISOString()
    }

    // Return as HTML for easy viewing
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Connection Test</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
            .success { background-color: #d4edda; color: #155724; }
            .error { background-color: #f8d7da; color: #721c24; }
            .warning { background-color: #fff3cd; color: #856404; }
        </style>
    </head>
    <body>
        <h1>🔍 Database Connection Status</h1>
        
        <div class="status ${result.hasUrl ? 'success' : 'error'}">
            <strong>Has DATABASE_URL:</strong> ${result.hasUrl ? '✅ Yes' : '❌ No'}
        </div>
        
        <div class="status ${result.isMongoUrl ? 'success' : 'error'}">
            <strong>Is MongoDB URL:</strong> ${result.isMongoUrl ? '✅ Yes' : '❌ No'}
        </div>
        
        <div class="status ${result.isPostgresUrl ? 'warning' : 'success'}">
            <strong>Is PostgreSQL URL:</strong> ${result.isPostgresUrl ? '⚠️ Yes (WRONG!)' : '✅ No'}
        </div>
        
        <div class="status">
            <strong>URL Preview:</strong> ${result.urlPrefix}
        </div>
        
        <div class="status">
            <strong>Timestamp:</strong> ${result.timestamp}
        </div>
        
        <hr>
        
        <h2>🎯 What This Means:</h2>
        ${result.isMongoUrl ? 
            '<p class="success">✅ <strong>GOOD:</strong> MongoDB connection string is set correctly!</p>' :
            '<p class="error">❌ <strong>PROBLEM:</strong> DATABASE_URL is not set to MongoDB. Please update it in Vercel dashboard.</p>'
        }
        
        <h3>📋 Expected MongoDB URL should start with:</h3>
        <code>mongodb+srv://ekaashidotcom_db_user:...</code>
        
        <h3>🔧 To Fix:</h3>
        <ol>
            <li>Go to <a href="https://vercel.com/nishants-projects-a4179263/jewelry-store/settings/environment-variables" target="_blank">Vercel Environment Variables</a></li>
            <li>Update DATABASE_URL to the MongoDB connection string</li>
            <li>Redeploy the application</li>
        </ol>
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
    <body>
        <h1>❌ Error checking database connection</h1>
        <p>${error instanceof Error ? error.message : String(error)}</p>
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