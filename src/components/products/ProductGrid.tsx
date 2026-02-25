'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ui/product-card'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchJsonWithRetry } from '@/lib/fetch-with-retry'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  categoryName?: string
  inStock: boolean
  featured: boolean
}

interface ProductGridProps {
  title?: string
  endpoint: string
  limit?: number
  showViewAll?: boolean
  viewAllLink?: string
}

function ProductGridContent({ 
  title, 
  endpoint, 
  limit, 
  showViewAll = false,
  viewAllLink = '/products'
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await fetchJsonWithRetry<{ success: boolean; data: Product[]; error?: string }>(
          endpoint,
          undefined,
          {
            maxRetries: 3,
            onRetry: (attempt, error) => {
              console.log(`Retry attempt ${attempt} for ${endpoint}:`, error.message)
              setRetryCount(attempt)
            }
          }
        )
        
        if (data.success) {
          const productData = limit ? data.data.slice(0, limit) : data.data
          setProducts(productData)
          setRetryCount(0)
        } else {
          throw new Error(data.error || 'Failed to load products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [endpoint, limit])

  const handleRetry = () => {
    setError(null)
    setRetryCount(0)
    setLoading(true)
    // Re-trigger useEffect by forcing a re-render
    setProducts([])
  }

  if (loading) {
    return (
      <div>
        <ProductGridSkeleton count={limit || 4} />
        {retryCount > 0 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Retrying... (Attempt {retryCount}/3)
            </p>
          </div>
        )}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load products
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button
          onClick={handleRetry}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💎</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-600">
          Check back soon for new arrivals
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export default function ProductGrid(props: ProductGridProps) {
  return (
    <ErrorBoundary>
      <ProductGridContent {...props} />
    </ErrorBoundary>
  )
}
