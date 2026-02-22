'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ui/product-card'
import ImageZoom from '@/components/ui/image-zoom'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/components/ui/toast'
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Shield, 
  Truck, 
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  CheckCircle,
  X,
  ZoomIn,
  RotateCw,
  Move
} from 'lucide-react'

interface ProductPageClientProps {
  product: {
    id: string
    name: string
    slug: string
    sku?: string
    description: string
    specifications?: string | null
    careInstructions?: string | null
    price: number
    comparePrice?: number
    images: string[]
    color?: string | null
    size?: string | null
    material?: string | null
    category: string
    categoryName: string
    inStock: boolean
    featured: boolean
    variants?: Array<{
      id: string
      sku: string
      name: string
      attributes: Record<string, string>
      price: number
      comparePrice?: number
      images: string[]
      inStock: boolean
      stock: number
    }>
  }
  relatedProducts: Array<{
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
  }>
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { showToast } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isWishlistLoading, setIsWishlistLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  
  // Get all available colors (main product + variants)
  const availableColors: Array<{color: string, source: 'main' | 'variant', data: any}> = []
  
  // Add main product color if it exists
  if (product.color) {
    availableColors.push({
      color: product.color,
      source: 'main',
      data: product
    })
  }
  
  // Add variant colors
  if (product.variants) {
    product.variants.forEach(variant => {
      if (variant.attributes.color && !availableColors.find(c => c.color.toLowerCase() === variant.attributes.color?.toLowerCase())) {
        availableColors.push({
          color: variant.attributes.color,
          source: 'variant',
          data: variant
        })
      }
    })
  }
  
  // Initialize selectedColor: if only one color, auto-select it; if multiple colors, select main product color if it exists
  const initialColor = availableColors.length === 1 
    ? availableColors[0].color 
    : (product.color || null)
  
  // Track selected color
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor)
  
  // Find the selected variant or use main product
  const selectedVariant = selectedColor 
    ? product.variants?.find(v => v.attributes.color?.toLowerCase() === selectedColor.toLowerCase())
    : null
  
  // Get current details based on selection
  const currentPrice = selectedVariant ? selectedVariant.price : product.price
  const currentComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice
  const currentImages = selectedVariant && selectedVariant.images.length > 0 ? selectedVariant.images : product.images
  const currentInStock = selectedVariant ? selectedVariant.inStock : product.inStock
  const currentStock = selectedVariant ? selectedVariant.stock : undefined
  const currentName = selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name
  const currentColor = selectedColor || product.color
  
  // Image zoom states
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const getColorBadge = (color?: string) => {
    if (!color) return null
    
    const colorMap: { [key: string]: string } = {
      gold: 'bg-yellow-400',
      silver: 'bg-gray-300',
      'rose gold': 'bg-pink-300',
      platinum: 'bg-gray-400',
      white: 'bg-white border border-gray-300',
      black: 'bg-black',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
    }

    const bgColor = colorMap[color.toLowerCase()] || 'bg-gray-200'

    return bgColor
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews (128)' },
    { id: 'care', label: 'Care Instructions' }
  ]

  // Image zoom handlers
  const openZoomModal = () => {
    setIsZoomModalOpen(true)
    setZoomLevel(1)
    setZoomPosition({ x: 0, y: 0 })
  }

  const closeZoomModal = () => {
    setIsZoomModalOpen(false)
    setZoomLevel(1)
    setZoomPosition({ x: 0, y: 0 })
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1))
    if (zoomLevel <= 1.5) {
      setZoomPosition({ x: 0, y: 0 })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - zoomPosition.x,
        y: e.clientY - zoomPosition.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      
      // Limit dragging within bounds
      const maxX = (zoomLevel - 1) * 200
      const maxY = (zoomLevel - 1) * 200
      
      setZoomPosition({
        x: Math.max(-maxX, Math.min(maxX, newX)),
        y: Math.max(-maxY, Math.min(maxY, newY))
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % 4)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + 4) % 4)
  }

  const handleAddToCart = async () => {
    // If multiple colors available but none selected, show error
    if (availableColors.length > 1 && !selectedColor) {
      showToast('Please select a color first', 'error')
      return
    }
    
    if (!currentInStock) return
    
    setIsAddingToCart(true)
    try {
      await addItem({
        id: selectedVariant ? selectedVariant.id : product.id,
        name: currentName,
        slug: product.slug,
        price: currentPrice,
        comparePrice: currentComparePrice,
        image: currentImages[0] || '',
        category: product.category
      }, quantity)
      
      showToast(`${currentName} added to cart!`, 'success')
    } catch (error) {
      showToast('Failed to add item to cart', 'error')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    // If multiple colors available but none selected, show error
    if (availableColors.length > 1 && !selectedColor) {
      showToast('Please select a color first', 'error')
      return
    }
    
    if (!currentInStock || isBuyingNow) return
    
    setIsBuyingNow(true)
    
    try {
      // Add to cart first
      await addItem({
        id: selectedVariant ? selectedVariant.id : product.id,
        name: currentName,
        slug: product.slug,
        price: currentPrice,
        comparePrice: currentComparePrice,
        image: currentImages[0] || '',
        category: product.category
      }, quantity)
      
      // Redirect to checkout using Next.js router
      router.push('/checkout')
    } catch (error) {
      console.error('Error during buy now:', error)
      showToast('Failed to process order', 'error')
      setIsBuyingNow(false)
    }
  }

  const toggleWishlist = async () => {
    if (isWishlistLoading) return
    
    setIsWishlistLoading(true)
    
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: 'DELETE'
        })
        const data = await response.json()
        
        if (data.success) {
          setIsWishlisted(false)
          showToast('Removed from wishlist', 'success')
          // Trigger header refresh
          window.dispatchEvent(new Event('wishlistUpdated'))
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: product.id })
        })
        const data = await response.json()
        
        if (data.success) {
          setIsWishlisted(true)
          showToast('Added to wishlist!', 'success')
          // Trigger header refresh
          window.dispatchEvent(new Event('wishlistUpdated'))
        } else if (data.error === 'Product already in wishlist') {
          setIsWishlisted(true)
          showToast('Already in wishlist', 'success')
        } else {
          showToast(data.error || 'Failed to add to wishlist', 'error')
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
      showToast('Failed to update wishlist', 'error')
    } finally {
      setIsWishlistLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-3 sm:py-4">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <Link href="/" className="text-gray-600 hover:text-amber-600 whitespace-nowrap">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-amber-600 whitespace-nowrap">Products</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/category/${product.category}`} className="text-gray-600 hover:text-amber-600 capitalize whitespace-nowrap">
              {product.category.replace('-', ' ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium line-clamp-1 break-all">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 mb-12 sm:mb-16">
          {/* Product Images */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl overflow-hidden shadow-lg group">
              <ImageZoom
                src={currentImages?.[selectedImageIndex] || ''}
                alt={product.name}
                className="w-full h-full"
                zoomScale={3}
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-8xl sm:text-9xl opacity-60">💎</div>
                  </div>
                }
              >
                {/* Sale Badge */}
                {currentComparePrice && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg z-10 pointer-events-auto">
                    SALE
                  </div>
                )}

                {/* Image Navigation */}
                <button 
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 pointer-events-auto z-10"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button 
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 pointer-events-auto z-10"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>

                {/* Zoom indicator */}
                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </ImageZoom>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {[...Array(Math.min(4, currentImages.length))].map((_, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index ? 'border-amber-600' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImageZoom
                    src={currentImages?.[index] || ''}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full"
                    zoomScale={2}
                    showZoomIndicator={false}
                    fallback={
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-2xl opacity-60">💎</div>
                      </div>
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm sm:text-base text-gray-600">(4.8)</span>
                <button className="text-sm sm:text-base text-amber-600 hover:underline cursor-pointer">128 reviews</button>
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {formatPrice(currentPrice)}
              </span>
              {currentComparePrice && (
                <>
                  <span className="text-lg sm:text-xl text-gray-500 line-through">
                    {formatPrice(currentComparePrice)}
                  </span>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-full">
                    {Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)}% OFF
                  </div>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {currentInStock ? (
                <>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  <span className="text-sm sm:text-base text-green-600 font-medium">
                    In Stock {currentStock !== undefined && `(${currentStock} available)`}
                  </span>
                </>
              ) : (
                <>
                  <div className="h-4 w-4 sm:h-5 sm:w-5 bg-red-600 rounded-full" />
                  <span className="text-sm sm:text-base text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="space-y-3 border-t border-b border-gray-200 py-4">
                <label className="text-sm font-medium text-gray-900">
                  Color {availableColors.length > 1 && !selectedColor && <span className="text-red-600">*</span>}
                </label>
                {availableColors.length > 1 && !selectedColor && (
                  <p className="text-xs text-gray-600">Please select a color</p>
                )}
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((colorOption, index) => {
                    const isSelected = selectedColor?.toLowerCase() === colorOption.color.toLowerCase()
                    
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedColor(colorOption.color)
                          setSelectedImageIndex(0)
                        }}
                        className={`flex items-center space-x-2 px-4 py-2 border-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-purple-600 bg-purple-50'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-full border-2 border-gray-300 ${getColorBadge(colorOption.color)}`}></span>
                        <span className="font-medium text-gray-900 capitalize">{colorOption.color}</span>
                        {isSelected && (
                          <CheckCircle className="h-4 w-4 text-purple-600" />
                        )}
                      </button>
                    )
                  })}
                </div>
                {currentColor && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Selected:</span>
                    <span className="font-medium capitalize">{currentColor}</span>
                    {currentStock !== undefined && (
                      <span className="text-green-600">• {currentStock} in stock</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-2 sm:space-y-3">
              <label className="text-sm font-medium text-gray-900">Quantity</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 sm:p-3 hover:bg-gray-50 transition-colors touch-manipulation"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-2 sm:py-3 font-medium min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 sm:p-3 hover:bg-gray-50 transition-colors touch-manipulation"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <span className="text-sm sm:text-base text-gray-600">
                  Total: <span className="font-bold text-gray-900">{formatPrice(currentPrice * quantity)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 touch-manipulation"
                  disabled={!currentInStock || isAddingToCart}
                >
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <div className="flex gap-3 sm:gap-4">
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 hover:border-red-500 hover:text-red-500 rounded-xl transition-all duration-300 touch-manipulation"
                    onClick={toggleWishlist}
                    disabled={isWishlistLoading}
                  >
                    <Heart className={`h-4 w-4 sm:h-5 sm:w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 hover:border-amber-600 hover:text-amber-600 rounded-xl transition-all duration-300 touch-manipulation"
                  >
                    <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </div>

              <Button 
                variant="outline"
                className="w-full py-3 sm:py-4 text-base sm:text-lg font-medium border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-300 touch-manipulation"
                disabled={!currentInStock || isBuyingNow}
                onClick={handleBuyNow}
              >
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                {isBuyingNow ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Lifetime Warranty</div>
                  <div className="text-xs sm:text-sm text-gray-600">Full protection</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Free Shipping</div>
                  <div className="text-xs sm:text-sm text-gray-600">On orders over ₹5,000</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm sm:text-base">Easy Returns</div>
                  <div className="text-xs sm:text-sm text-gray-600">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-12 sm:mb-16">
          <div className="border-b border-gray-200 mb-6 sm:mb-8">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-1 border-b-2 font-medium whitespace-nowrap transition-colors text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'border-amber-600 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="prose max-w-none">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
                {product.description ? (
                  <div className="text-gray-600 leading-relaxed">
                    <pre className="whitespace-pre-wrap font-sans">{product.description}</pre>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No description available for this product.</div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                {product.specifications ? (
                  <div className="prose max-w-none text-gray-600">
                    <pre className="whitespace-pre-wrap font-sans">{product.specifications}</pre>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No specifications available for this product.</div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                          <span className="text-amber-600 font-semibold">
                            {['S', 'P', 'A'][index]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {['Sarah Johnson', 'Priya Sharma', 'Anita Patel'][index]}
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">2 days ago</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        {[
                          "Absolutely stunning jewelry! The quality is exceptional and the designs are so elegant. I've received countless compliments on my earrings.",
                          "Perfect for my wedding! The jewelry set was exactly what I was looking for. Beautiful craftsmanship and arrived perfectly packaged.",
                          "Great value for money! The ethnic earrings are gorgeous and the customer service was excellent. Will definitely shop again."
                        ][index]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Care Instructions</h3>
                {product.careInstructions ? (
                  <div className="prose max-w-none text-gray-600">
                    <pre className="whitespace-pre-wrap font-sans">{product.careInstructions}</pre>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No care instructions available for this product.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-3 sm:mb-4">
              You Might Also <span className="font-semibold">Like</span>
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-amber-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeZoomModal}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 4}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Plus className="h-6 w-6" />
              </button>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
              >
                <Minus className="h-6 w-6" />
              </button>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {zoomLevel}x
              </div>
            </div>

            {/* Image Navigation */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Zoom Instructions */}
            {zoomLevel > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm flex items-center space-x-2">
                <Move className="h-4 w-4" />
                <span>Drag to pan around</span>
              </div>
            )}

            {/* Main Zoomed Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div
                className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                  width: `${400 * zoomLevel}px`,
                  height: `${400 * zoomLevel}px`,
                  transform: `translate(${zoomPosition.x}px, ${zoomPosition.y}px)`,
                  cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                }}
              >
                <div 
                  className="opacity-60"
                  style={{ fontSize: `${6 * zoomLevel}rem` }}
                >
                  💎
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {[...Array(4)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 transition-all duration-200 ${
                    selectedImageIndex === index ? 'border-white' : 'border-white/30'
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-lg opacity-60">💎</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}