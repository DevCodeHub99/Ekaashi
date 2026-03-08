'use client'

import { useProducts } from '@/hooks/use-products'
import ProductCard from '@/components/ui/product-card'
import { ProductGridSkeleton } from '@/components/ui/skeleton'
import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface InfiniteProductGridProps {
  endpoint: string
  limit?: number
  emptyMessage?: string
}

export default function InfiniteProductGrid({ 
  endpoint, 
  limit = 12,
  emptyMessage = "No products found"
}: InfiniteProductGridProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useProducts({ endpoint, limit })

  const observerTarget = useRef<HTMLDivElement>(null)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // Loading state
  if (isLoading) {
    return <ProductGridSkeleton count={limit} />
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {error instanceof Error ? error.message : 'Failed to load products'}
        </h3>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Flatten all pages into single array
  const allProducts = data?.pages.flatMap(page => page.data) || []

  // Empty state
  if (allProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-20 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-amber-600">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm">Loading more...</span>
          </div>
        )}
        {!hasNextPage && allProducts.length > 0 && (
          <p className="text-sm text-gray-500">No more products to load</p>
        )}
      </div>
    </div>
  )
}
