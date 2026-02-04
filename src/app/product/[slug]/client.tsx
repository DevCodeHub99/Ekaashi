'use client'

import { useState } from 'react'
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
    description: string
    price: number
    comparePrice?: number
    images: string[]
    category: string
    categoryName: string
    inStock: boolean
    featured: boolean
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
  const { addItem } = useCart()
  const { showToast } = useToast()
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  
  // Image zoom states
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
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
    if (!product.inStock) return
    
    setIsAddingToCart(true)
    try {
      await addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: product.images[0] || '/images/product-placeholder.jpg',
        category: product.category
      }, quantity)
      
      showToast(`${product.name} added to cart!`, 'success')
    } catch (error) {
      showToast('Failed to add item to cart', 'error')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product.inStock) return
    
    // Add to cart first
    await handleAddToCart()
    
    // Redirect to checkout
    window.location.href = '/checkout'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-amber-600">Home</Link>
            <span className="text-gray-400">/</span>
            <Link href="/products" className="text-gray-600 hover:text-amber-600">Products</Link>
            <span className="text-gray-400">/</span>
            <Link href={`/category/${product.category}`} className="text-gray-600 hover:text-amber-600 capitalize">
              {product.category.replace('-', ' ')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl overflow-hidden shadow-lg group">
              <ImageZoom
                src={product.images?.[selectedImageIndex] || '/images/product-placeholder.jpg'}
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
                {product.comparePrice && (
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
              {[...Array(4)].map((_, index) => (
                <button
                  key={index}
                  className={`aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    selectedImageIndex === index ? 'border-amber-600' : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <ImageZoom
                    src={product.images?.[index] || '/images/product-placeholder.jpg'}
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
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-gray-600">(4.8)</span>
                <button className="text-amber-600 hover:underline cursor-pointer">128 reviews</button>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
                  </div>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              {product.inStock ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <>
                  <div className="h-5 w-5 bg-red-600 rounded-full" />
                  <span className="text-red-600 font-medium">Out of Stock</span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-900">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-gray-600">
                  Total: <span className="font-bold text-gray-900">{formatPrice(product.price * quantity)}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={!product.inStock || isAddingToCart}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                
                <Button
                  variant="outline"
                  className="px-6 py-4 border-2 border-gray-300 hover:border-amber-600 hover:text-amber-600 rounded-xl transition-all duration-300"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  className="px-6 py-4 border-2 border-gray-300 hover:border-amber-600 hover:text-amber-600 rounded-xl transition-all duration-300"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <Button 
                onClick={handleBuyNow}
                variant="outline"
                className="w-full py-4 text-lg font-medium border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all duration-300"
                disabled={!product.inStock || isAddingToCart}
              >
                <Zap className="h-5 w-5 mr-2" />
                {isAddingToCart ? 'Processing...' : 'Buy Now'}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Lifetime Warranty</div>
                  <div className="text-sm text-gray-600">Full protection</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">On orders over $100</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <RotateCcw className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">30-day policy</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap transition-colors ${
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Details</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {product.description} This exquisite piece is crafted with the finest materials and attention to detail, 
                    making it perfect for special occasions or everyday elegance.
                  </p>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-2" />
                      Premium quality materials
                    </li>
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-2" />
                      Handcrafted by skilled artisans
                    </li>
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-2" />
                      Hypoallergenic and skin-safe
                    </li>
                    <li className="flex items-center">
                      <Award className="h-4 w-4 text-amber-600 mr-2" />
                      Comes with authenticity certificate
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Ekaashi?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Quality Assurance</div>
                        <div className="text-sm text-gray-600">Each piece undergoes rigorous quality checks</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Ethical Sourcing</div>
                        <div className="text-sm text-gray-600">Responsibly sourced materials and fair trade practices</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-gray-900">Expert Craftsmanship</div>
                        <div className="text-sm text-gray-600">Created by master jewelers with decades of experience</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Material:</dt>
                      <dd className="font-medium">Sterling Silver</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Finish:</dt>
                      <dd className="font-medium">Gold Plated</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Weight:</dt>
                      <dd className="font-medium">12.5g</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Dimensions:</dt>
                      <dd className="font-medium">2.5cm x 1.8cm</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Stone Type:</dt>
                      <dd className="font-medium">Cubic Zirconia</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Care Information</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Store in a dry place</li>
                    <li>• Clean with soft cloth</li>
                    <li>• Avoid contact with perfumes</li>
                    <li>• Remove before swimming</li>
                    <li>• Professional cleaning recommended</li>
                  </ul>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Care</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Clean with a soft, lint-free cloth after each wear</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Store in individual pouches to prevent scratching</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <span>Keep away from moisture and humidity</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">What to Avoid</h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start space-x-3">
                      <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                      </div>
                      <span>Contact with perfumes, lotions, and chemicals</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                      </div>
                      <span>Exposure to water while swimming or showering</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-5 w-5 bg-red-100 rounded-full flex items-center justify-center mt-0.5">
                        <div className="h-2 w-2 bg-red-600 rounded-full"></div>
                      </div>
                      <span>Harsh cleaning agents or abrasive materials</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-light text-gray-900 mb-4">
              You Might Also <span className="font-semibold">Like</span>
            </h2>
            <div className="w-20 h-0.5 bg-amber-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
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