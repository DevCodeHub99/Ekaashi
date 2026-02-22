'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
}

// Default emoji mapping for categories (fallback)
const categoryEmojis: Record<string, string> = {
  'party-wear-earrings': '✨',
  'ethnic-earrings': '🌸',
  'casual-earrings': '🍃',
  'casual-necklace': '📿',
  'jewelry-set': '💍',
  'rings': '💎',
  'bracelets': '⭐',
  'anklets': '🌟',
  'pendants': '✨',
  'chains': '🔗'
}

// Default gradient colors for categories
const categoryGradients: Record<number, string> = {
  0: 'from-amber-100 to-yellow-100',
  1: 'from-rose-100 to-pink-100',
  2: 'from-green-100 to-emerald-100',
  3: 'from-blue-100 to-indigo-100',
  4: 'from-purple-100 to-violet-100',
  5: 'from-orange-100 to-red-100',
  6: 'from-teal-100 to-cyan-100',
  7: 'from-pink-100 to-rose-100',
  8: 'from-indigo-100 to-purple-100',
  9: 'from-yellow-100 to-amber-100'
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const getEmoji = (slug: string) => {
    return categoryEmojis[slug] || '💎'
  }

  const getGradient = (index: number) => {
    return categoryGradients[index % 10] || 'from-gray-100 to-gray-200'
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📁</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Yet</h3>
        <p className="text-gray-600">Categories will appear here once added by the admin.</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile: Horizontal Scrollable Carousel */}
      <div className="block lg:hidden relative">
        <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 px-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`} 
              className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer"
            >
              <div className={`relative overflow-hidden rounded-lg ${category.image ? '' : `bg-gradient-to-br ${getGradient(index)}`} aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500`}>
                {category.image ? (
                  <>
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                  <div className="text-center text-white">
                    {!category.image && (
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">{getEmoji(category.slug)}</div>
                    )}
                    <h3 className="text-xs sm:text-sm font-semibold mb-1">{category.name}</h3>
                    <p className="text-xs opacity-90">{category.productCount} Products</p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-amber-600">
            <span className="text-xs">Swipe to explore</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className={`hidden lg:grid gap-6 ${categories.length <= 3 ? 'grid-cols-3' : categories.length === 4 ? 'grid-cols-4' : 'grid-cols-5'}`}>
        {categories.map((category, index) => (
          <Link 
            key={category.id} 
            href={`/category/${category.slug}`} 
            className="group cursor-pointer"
          >
            <div className={`relative overflow-hidden rounded-lg ${category.image ? '' : `bg-gradient-to-br ${getGradient(index)}`} aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500`}>
              {category.image ? (
                <>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </>
              ) : (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="text-center text-white">
                  {!category.image && (
                    <div className="text-4xl mb-3 opacity-90">{getEmoji(category.slug)}</div>
                  )}
                  <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-90">{category.productCount} Products</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
