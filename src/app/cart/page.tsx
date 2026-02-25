'use client'

import { useCart } from '@/contexts/cart-context'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityUpdate = async (id: string, newQuantity: number) => {
    setIsUpdating(id)
    updateQuantity(id, newQuantity)
    setTimeout(() => setIsUpdating(null), 300)
  }

  const handleRemoveItem = (id: string) => {
    removeItem(id)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-6 sm:mb-8">
              <ShoppingBag className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Your Cart is Empty</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 px-4">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 sm:px-8 py-3 rounded-lg font-medium text-sm sm:text-base touch-manipulation">
                  <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-sm sm:text-base text-gray-600">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Cart Items</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 border-red-300 hover:bg-red-50 text-xs sm:text-sm"
                    >
                      Clear Cart
                    </Button>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                        {/* Product Image */}
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
                                <div className="text-xl sm:text-2xl">💎</div>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <Link href={`/product/${item.slug}`}>
                              <h3 className="text-sm sm:text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors line-clamp-2">
                                {item.name}
                              </h3>
                            </Link>
                            <p className="text-xs sm:text-sm text-gray-500 capitalize mt-1">{item.category}</p>
                            <div className="flex items-center space-x-2 mt-1 sm:mt-2">
                              <span className="text-base sm:text-lg font-bold text-gray-900">
                                {formatPrice(item.price)}
                              </span>
                              {item.comparePrice && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  {formatPrice(item.comparePrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Controls & Remove - Mobile Layout */}
                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || isUpdating === item.id}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 touch-manipulation"
                            >
                              <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <span className="px-3 sm:px-4 py-2 font-medium min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base">
                              {isUpdating === item.id ? '...' : item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                              disabled={isUpdating === item.id}
                              className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50 touch-manipulation"
                            >
                              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>

                          {/* Item Total & Remove */}
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="text-right">
                              <div className="text-sm sm:text-lg font-bold text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation"
                            >
                              <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm lg:sticky lg:top-8">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">{formatPrice(totalPrice * 0.1)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <div className="flex justify-between">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {formatPrice(totalPrice + (totalPrice * 0.1))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base touch-manipulation">
                      <Link href="/checkout">
                        Proceed to Checkout
                      </Link>
                    </Button>
                    <Link href="/products">
                      <Button variant="outline" className="w-full py-3 sm:py-3.5 rounded-lg font-medium text-sm sm:text-base touch-manipulation">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Indicators */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>Free shipping on orders over ₹5,000</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>30-day return policy</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}