'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/components/ui/toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { ShoppingBag, User, MapPin, CreditCard, CheckCircle, ArrowLeft, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: session?.user?.email || '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  })
  
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  // Authentication check for guest users
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)

  useEffect(() => {
    // Show auth prompt for guest users (optional - they can still checkout as guest)
    if (!session && items.length > 0) {
      const timer = setTimeout(() => {
        setShowAuthPrompt(true)
      }, 2000) // Show after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [session, items.length])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push('/cart')
    }
  }, [items, router, orderPlaced])

  // Update email when session changes
  useEffect(() => {
    if (session?.user?.email) {
      setFormData(prev => ({ ...prev, email: session.user.email! }))
    }
  }, [session])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const requiredFields = ['email', 'firstName', 'lastName', 'phone', 'address', 'city', 'state', 'zipCode']
    for (const field of requiredFields) {
      if (!formData[field as keyof CheckoutFormData]) {
        showToast(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`, 'error')
        return false
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showToast('Please enter a valid email address', 'error')
      return false
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      showToast('Please enter a valid 10-digit phone number', 'error')
      return false
    }

    return true
  }

  const handlePlaceOrder = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems
        }),
      })

      const data = await response.json()

      if (data.success) {
        setOrderId(data.data.id)
        setOrderPlaced(true)
        clearCart()
        showToast('Order placed successfully!', 'success')
      } else {
        showToast(data.error || 'Failed to place order', 'error')
      }
    } catch (error) {
      showToast('An error occurred while placing the order', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Order success page
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-base sm:text-lg font-semibold text-gray-900 break-all">{orderId}</p>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Button asChild className="w-full bg-amber-600 hover:bg-amber-700 text-sm sm:text-base py-2 sm:py-3 touch-manipulation">
                  <Link href="/">Continue Shopping</Link>
                </Button>
                {session && (
                  <Button asChild variant="outline" className="w-full text-sm sm:text-base py-2 sm:py-3 touch-manipulation">
                    <Link href="/orders">View My Orders</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/cart" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-3 sm:mb-4 text-sm sm:text-base touch-manipulation">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Authentication Prompt for Guest Users */}
          {showAuthPrompt && !session && (
            <div className="lg:col-span-3 mb-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-amber-800 text-sm sm:text-base">Sign in for a better experience</h3>
                    <p className="text-xs sm:text-sm text-amber-700 mt-1">
                      Create an account to track your orders, save addresses, and get exclusive offers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3">
                      <Link href="/auth/signin?callbackUrl=/checkout" className="flex-1 sm:flex-none">
                        <Button size="sm" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm touch-manipulation">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup?callbackUrl=/checkout" className="flex-1 sm:flex-none">
                        <Button size="sm" variant="outline" className="w-full sm:w-auto border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white text-xs sm:text-sm touch-manipulation">
                          Create Account
                        </Button>
                      </Link>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setShowAuthPrompt(false)}
                        className="w-full sm:w-auto text-amber-600 hover:bg-amber-100 text-xs sm:text-sm touch-manipulation"
                      >
                        Continue as Guest
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAuthPrompt(false)}
                    className="text-amber-600 hover:bg-amber-100 flex-shrink-0 touch-manipulation"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!!session?.user?.email}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 touch-manipulation"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                    placeholder="Enter full address"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent touch-manipulation"
                    >
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
                  <p className="text-amber-800 text-xs sm:text-sm">
                    💳 Cash on Delivery (COD) - Pay when you receive your order
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="lg:sticky lg:top-8">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Order Items */}
                <div className="space-y-2 sm:space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2 sm:space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm sm:text-base">
                            💎
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-xs sm:text-sm font-medium text-gray-900 flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 sm:pt-4 space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base font-medium border-t pt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={loading || items.length === 0}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-sm sm:text-base py-2 sm:py-3 touch-manipulation"
                >
                  {loading ? 'Placing Order...' : `Place Order - ${formatPrice(totalPrice)}`}
                </Button>

                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}