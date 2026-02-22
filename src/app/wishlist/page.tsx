'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useToast } from '@/components/ui/toast'
import { getSessionId } from '@/lib/session'

interface WishlistItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    images: string[]
    inStock: boolean
    category: {
      name: string
    }
  }
  createdAt: string
}

export default function WishlistPage() {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  useEffect(() => {
    fetchWishlist()
  }, [session])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist')
      const data = await response.json()

      if (data.success) {
        setWishlistItems(data.data)
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    try {
      setRemovingId(productId)
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setWishlistItems(prev => prev.filter(item => item.productId !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingId(null)
    }
  }

  const addToCart = async (product: WishlistItem['product']) => {
    try {
      setAddingToCartId(product.id)
      
      // Use cart context which handles sessionId automatically
      await addItem({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        comparePrice: product.comparePrice,
        image: product.images[0] || '',
        category: product.category.name
      }, 1)

      showToast(`${product.name} added to cart!`, 'success')
      
      // Optionally remove from wishlist after adding to cart
      await removeFromWishlist(product.id)
    } catch (error) {
      console.error('Error adding to cart:', error)
      showToast('Failed to add item to cart', 'error')
    } finally {
      setAddingToCartId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 flex items-center gap-3">
                <Heart className="h-8 w-8 text-amber-600 fill-amber-600" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-light text-gray-900 mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Save your favorite items to your wishlist and shop them later!
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/products">
                Browse Products
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Product Image */}
                <Link href={`/product/${item.product.slug}`} className="block relative aspect-square bg-gray-100">
                  <Image
                    src={item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!item.product.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                  {item.product.comparePrice && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SALE
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link href={`/product/${item.product.slug}`}>
                    <p className="text-xs text-gray-500 mb-1">{item.product.category.name}</p>
                    <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold text-gray-900">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </span>
                    {item.product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.product.comparePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => addToCart(item.product)}
                      disabled={!item.product.inStock || addingToCartId === item.product.id}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {addingToCartId === item.product.id ? 'Adding...' : 'Add to Cart'}
                    </Button>
                    <Button
                      onClick={() => removeFromWishlist(item.product.id)}
                      disabled={removingId === item.product.id}
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
