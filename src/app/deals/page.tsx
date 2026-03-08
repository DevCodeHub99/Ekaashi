'use client'

import { Metadata } from 'next'
import InfiniteProductGrid from '@/components/products/InfiniteProductGrid'

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="text-6xl mb-4">🔥</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Deals & Offers</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Don't miss out on these amazing deals! Limited time offers on our most popular jewelry pieces.
        </p>
      </div>

      {/* Special Offer Banner */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Special Sale Event!</h2>
        <p className="text-lg mb-4">Up to 50% off on selected items</p>
        <div className="text-sm opacity-90">*Limited time offer. While stocks last.</div>
      </div>

      {/* Products Grid with Infinite Scroll */}
      <InfiniteProductGrid 
        endpoint="/api/products/deals" 
        limit={12}
        emptyMessage="No deals available right now. Check back soon!"
      />
    </div>
  )
}