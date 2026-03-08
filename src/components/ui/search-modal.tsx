'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X, Loader2 } from 'lucide-react'
import { Button } from './button'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  categoryName: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setSearchQuery('')
      setResults([])
      setShowResults(false)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        searchProducts(searchQuery)
      } else {
        setResults([])
        setShowResults(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const searchProducts = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.data)
        setShowResults(true)
      }
    } catch (error) {
      console.error('Error searching products:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-24">
      {/* Backdrop */}
      <div 
        className="absolute inset-0" 
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-2xl mx-4 rounded-lg shadow-2xl max-h-[80vh] flex flex-col">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search for jewelry, earrings, necklaces..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-base"
          />
          {isLoading && <Loader2 className="h-5 w-5 text-amber-600 animate-spin" />}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {showResults && results.length > 0 && (
            <div className="p-4">
              <div className="text-sm text-gray-600 mb-3">
                Found {results.length} {results.length === 1 ? 'result' : 'results'}
              </div>
              <div className="space-y-3">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleClose}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">
                          💎
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{product.categoryName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-amber-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showResults && results.length === 0 && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try searching with different keywords
              </p>
            </div>
          )}

          {!showResults && !isLoading && (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">💎</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Search for jewelry</h3>
              <p className="text-gray-600">
                Start typing to find your perfect piece
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
