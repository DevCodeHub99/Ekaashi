import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const databaseUrl = process.env.DATABASE_URL
    
    // Basic checks
    const checks = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasUrl: !!databaseUrl,
      urlType: databaseUrl ? (
        databaseUrl.startsWith('mongodb') ? 'mongodb' : 
        databaseUrl.startsWith('postgresql') ? 'postgresql' : 
        'unknown'
      ) : 'none',
      urlPrefix: databaseUrl ? databaseUrl.substring(0, 50) + '...' : 'No DATABASE_URL found'
    }

    // Test Prisma connection
    let prismaStatus = 'not tested'
    let userCount = 0
    
    try {
      const { prisma } = await import('@/lib/prisma')
      await prisma.$connect()
      userCount = await prisma.user.count()
      prismaStatus = 'connected'
      await prisma.$disconnect()
    } catch (error) {
      prismaStatus = `error: ${error instanceof Error ? error.message.substring(0, 100) : String(error).substring(0, 100)}`
    }

    const result = {
      ...checks,
      database: {
        prismaStatus,
        userCount
      }
    }

    // Return HTML for easy viewing
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Database Connection Check</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container { 
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 { 
                color: #333;
                margin-bottom: 10px;
                font-size: 28px;
            }
            .subtitle {
                color: #666;
                margin-bottom: 30px;
                font-size: 14px;
            }
            .status { 
                padding: 15px;
                margin: 15px 0;
                border-radius: 8px;
                border-left: 5px solid;
                background: #f8f9fa;
            }
            .success { 
                background-color: #d4edda;
                color: #155724;
                border-color: #28a745;
            }
            .error { 
                background-color: #f8d7da;
                color: #721c24;
                border-color: #dc3545;
            }
            .warning { 
                background-color: #fff3cd;
                color: #856404;
                border-color: #ffc107;
            }
            .info { 
                background-color: #d1ecf1;
                color: #0c5460;
                border-color: #17a2b8;
            }
            .label {
                font-weight: 600;
                margin-bottom: 5px;
            }
            .value {
                font-family: 'Courier New', monospace;
                background: #f8f9fa;
                padding: 8px;
                border-radius: 4px;
                word-break: break-all;
                font-size: 13px;
            }
            .section {
                margin: 25px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            .section h2 {
                margin-top: 0;
                color: #495057;
                font-size: 18px;
            }
            .icon {
                font-size: 24px;
                margin-right: 10px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background: #667eea;
                color: white;
                text-decoration: none;
                border-radius: 6px;
                margin-top: 20px;
                font-weight: 600;
                transition: background 0.3s;
            }
            .button:hover {
                background: #5568d3;
            }
            code {
                background: #f8f9fa;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔍 Database Connection Check</h1>
            <p class="subtitle">Ekaashi Jewelry Store - Production Diagnostics</p>
            
            <div class="section">
                <h2>📊 Environment Info</h2>
                <div class="status info">
                    <div class="label">Timestamp:</div>
                    <div class="value">${result.timestamp}</div>
                </div>
                <div class="status info">
                    <div class="label">Environment:</div>
                    <div class="value">${result.environment}</div>
                </div>
            </div>

            <div class="section">
                <h2>🔗 Database URL Check</h2>
                <div class="status ${result.hasUrl ? 'success' : 'error'}">
                    <div class="label">Has DATABASE_URL:</div>
                    <div class="value">${result.hasUrl ? '✅ Yes' : '❌ No - DATABASE_URL not set!'}</div>
                </div>
                
                <div class="status ${result.urlType === 'mongodb' ? 'success' : 'error'}">
                    <div class="label">URL Type:</div>
                    <div class="value">${result.urlType === 'mongodb' ? '✅ MongoDB' : '❌ ' + result.urlType}</div>
                </div>
                
                <div class="status info">
                    <div class="label">URL Preview:</div>
                    <div class="value">${result.urlPrefix}</div>
                </div>
            </div>

            <div class="section">
                <h2>🗄️ Database Connection Test</h2>
                <div class="status ${result.database.prismaStatus === 'connected' ? 'success' : 'error'}">
                    <div class="label">Prisma Status:</div>
                    <div class="value">${result.database.prismaStatus}</div>
                </div>
                
                ${result.database.prismaStatus === 'connected' ? `
                <div class="status success">
                    <div class="label">Users in Database:</div>
                    <div class="value">✅ ${result.database.userCount} user(s) found</div>
                </div>
                ` : ''}
            </div>

            <div class="section">
                <h2>🎯 Diagnosis</h2>
                ${result.database.prismaStatus === 'connected' ? `
                    <div class="status success">
                        <span class="icon">✅</span>
                        <strong>GOOD:</strong> Database connection is working!
                        ${result.database.userCount === 0 ? '<br><br>⚠️ Database is empty. Run <code>/api/seed-mongodb</code> to add sample data.' : ''}
                    </div>
                ` : `
                    <div class="status error">
                        <span class="icon">❌</span>
                        <strong>PROBLEM:</strong> Database connection failed!
                        <br><br>
                        <strong>Possible causes:</strong>
                        <ul>
                            <li>DATABASE_URL not set in Vercel environment variables</li>
                            <li>DATABASE_URL is incorrect or expired</li>
                            <li>MongoDB Atlas network access not configured (add 0.0.0.0/0)</li>
                            <li>Build cache issue - try clearing Vercel build cache</li>
                        </ul>
                    </div>
                `}
            </div>

            <div class="section">
                <h2>🔧 Next Steps</h2>
                ${result.database.prismaStatus === 'connected' ? `
                    ${result.database.userCount === 0 ? `
                        <p>Database is connected but empty. Seed it with sample data:</p>
                        <ol>
                            <li>Open browser console (F12)</li>
                            <li>Run: <code>fetch('/api/seed-mongodb', {method: 'POST'}).then(r => r.json()).then(d => console.log(d))</code></li>
                            <li>Refresh the homepage to see products</li>
                        </ol>
                    ` : `
                        <p>✅ Everything looks good! Your database is connected and has data.</p>
                        <a href="/" class="button">Go to Homepage</a>
                        <a href="/admin" class="button">Go to Admin Panel</a>
                    `}
                ` : `
                    <p><strong>Fix the database connection:</strong></p>
                    <ol>
                        <li>Go to <a href="https://vercel.com/nishants-projects-a4179263/jewelry-store/settings/environment-variables" target="_blank">Vercel Environment Variables</a></li>
                        <li>Check DATABASE_URL is set to MongoDB connection string</li>
                        <li>Should start with: <code>mongodb+srv://...</code></li>
                        <li>Clear build cache in Vercel settings</li>
                        <li>Redeploy the application</li>
                    </ol>
                `}
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 13px;">
                    Ekaashi Jewelry Store • MongoDB Connection Diagnostics
                </p>
            </div>
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
    <head>
        <title>Error</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f8d7da; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
            h1 { color: #721c24; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>❌ Critical Error</h1>
            <p><strong>Error:</strong> ${error instanceof Error ? error.message : String(error)}</p>
            <p>This suggests a serious deployment or configuration issue.</p>
        </div>
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