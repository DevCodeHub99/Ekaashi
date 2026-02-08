import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Revalidate all product pages
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/new-arrivals')
    revalidatePath('/deals')
    revalidatePath('/category/[slug]', 'page')
    revalidatePath('/product/[slug]', 'page')

    return NextResponse.json({
      success: true,
      message: 'Cache cleared! All pages will show fresh data on next visit.',
      revalidated: [
        '/',
        '/products',
        '/new-arrivals',
        '/deals',
        '/category/*',
        '/product/*'
      ],
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

export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to revalidate cache',
    usage: 'fetch("/api/revalidate", { method: "POST" })'
  })
}
