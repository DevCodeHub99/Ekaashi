'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ui/product-card'

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

export default function ProductGrid({ 
  title, 
  endpoint, 
  limit, 
  showViewAll = false,
  viewAllLink = '/products'
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(endpoint)
        const data = await response.json()
        
        if (data.success) {
          const productData = limit ? data.data.slice(0, limit) : data.data
          setProducts(productData)
        } else {
          setError('Failed to load products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [endpoint, limit])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {[...Array(limit || 8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg" />
            <div className="h-4 bg-gray-200 rounded mt-4" />
            <div className="h-4 bg-gray-200 rounded mt-2 w-2/3" />
            <div className="h-8 bg-gray-200 rounded mt-4" />
          </div>
        ))}
      </div>
    )
  }

  if (error || products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💎</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'No products available'}
        </h3>
        <p className="text-gray-600">
          Check back soon for new arrivals!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
