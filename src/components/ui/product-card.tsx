'use client'

import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react'
import { Button } from './button'
import { useCart } from '@/contexts/cart-context'
import { useToast } from './toast'
import { useState } from 'react'
import ImageZoom from './image-zoom'

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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation to product page
    
    if (!product.inStock || isAdding) return
    
    setIsAdding(true)
    
    try {
      await addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: product.images?.[0] || '/images/product-placeholder.jpg',
        category: product.category || 'jewelry'
      })
      
      showToast(`${product.name} added to cart!`, 'success')
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Failed to add item to cart', 'error')
    } finally {
      setIsAdding(false)
    }
  }
  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-200 w-full flex flex-col h-full">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square bg-gray-50 overflow-hidden relative cursor-pointer">
          <ImageZoom
            src={product.images?.[0] || '/images/product-placeholder.jpg'}
            alt={product.name}
            className="w-full h-full"
            zoomScale={2}
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 group-hover:scale-110 transition-transform duration-500">
                <div className="text-4xl sm:text-5xl lg:text-6xl opacity-70 group-hover:opacity-90 transition-opacity duration-300">💎</div>
              </div>
            }
          >
            {/* Sale badge */}
            {product.comparePrice && (
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-lg pointer-events-auto z-10">
                SALE
              </div>
            )}
            
            {/* Quick action buttons - Hidden on mobile, shown on desktop */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 hidden sm:flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-auto">
              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm rounded-full w-8 h-8 cursor-pointer">
                <Heart className="h-3 w-3 text-gray-600 hover:text-red-500 transition-colors" />
              </Button>
              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm rounded-full w-8 h-8 cursor-pointer">
                <Eye className="h-3 w-3 text-gray-600 hover:text-amber-600 transition-colors" />
              </Button>
            </div>
            
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </ImageZoom>
        </div>
      </Link>
      
      <div className="p-3 sm:p-4 lg:p-6 flex flex-col flex-grow">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-gray-900 mb-2 sm:mb-3 hover:text-amber-600 transition-colors line-clamp-2 text-sm sm:text-base lg:text-lg leading-tight min-h-[2.5rem] sm:min-h-[3rem] cursor-pointer">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-start justify-between mb-3 sm:mb-4 min-h-[2.5rem]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
            <span className="font-bold text-base sm:text-lg lg:text-xl text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice ? (
              <span className="text-xs sm:text-sm text-gray-500 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            ) : (
              <span className="text-xs sm:text-sm text-transparent">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="flex-shrink-0 min-w-[60px] flex justify-end">
            {product.comparePrice ? (
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow-sm">
                {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
              </div>
            ) : (
              <div className="w-[60px] h-[20px]"></div>
            )}
          </div>
        </div>
        
        {/* Rating stars */}
        <div className="flex items-center space-x-1 mb-3 sm:mb-4 min-h-[1.5rem]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">(4.8)</span>
        </div>
        
        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>
        
        <Button 
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 text-xs sm:text-sm lg:text-base mt-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </Button>
        
        {!product.inStock && (
          <div className="mt-2 sm:mt-3 text-center">
            <span className="text-xs sm:text-sm text-red-600 font-medium bg-red-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-red-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>
    </div>
  )
}