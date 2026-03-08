'use client'

import InfiniteProductGrid from '@/components/products/InfiniteProductGrid'

export default function NewArrivalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="text-6xl mb-4">✨</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Be the first to discover our latest jewelry designs. Fresh styles added weekly!
        </p>
      </div>

      {/* New Arrivals Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-8 mb-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Just Arrived!</h2>
        <p className="text-lg mb-4">Latest designs fresh from our artisans</p>
        <div className="text-sm opacity-90">*New items added every week</div>
      </div>

      {/* Products Grid with Infinite Scroll */}
      <InfiniteProductGrid 
        endpoint="/api/products/new-arrivals" 
        limit={12}
        emptyMessage="No new arrivals yet. Check back soon!"
      />

      {/* Newsletter Signup */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Updated</h3>
        <p className="text-gray-600 mb-6">
          Subscribe to be the first to know about new arrivals and exclusive offers
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
          <button className="bg-rose-600 text-white px-6 py-3 rounded-lg hover:bg-rose-700 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  )
}