import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl sm:text-9xl opacity-20 mb-4">💎</div>
            <h1 className="text-6xl sm:text-8xl font-light text-gray-300 mb-4">404</h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-light text-gray-900 mb-4">
              Product <span className="font-semibold">Not Found</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto">
              Sorry, we couldn't find the jewelry piece you're looking for. 
              It might have been moved, discontinued, or the link might be incorrect.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/">
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 rounded-xl transition-all duration-300">
              <Link href="/products">
                <Search className="h-5 w-5 mr-2" />
                Browse All Products
              </Link>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              What would you like to do?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/new-arrivals" className="group p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300">
                <div className="text-2xl mb-2">✨</div>
                <div className="font-medium text-gray-900 group-hover:text-amber-600">New Arrivals</div>
                <div className="text-sm text-gray-600">Latest jewelry pieces</div>
              </Link>
              
              <Link href="/deals" className="group p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300">
                <div className="text-2xl mb-2">🔥</div>
                <div className="font-medium text-gray-900 group-hover:text-amber-600">Special Deals</div>
                <div className="text-sm text-gray-600">Discounted items</div>
              </Link>
              
              <Link href="/category/party-wear-earrings" className="group p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300">
                <div className="text-2xl mb-2">💫</div>
                <div className="font-medium text-gray-900 group-hover:text-amber-600">Party Wear</div>
                <div className="text-sm text-gray-600">Glamorous pieces</div>
              </Link>
              
              <Link href="/category/ethnic-earrings" className="group p-4 rounded-xl border border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-300">
                <div className="text-2xl mb-2">🌸</div>
                <div className="font-medium text-gray-900 group-hover:text-amber-600">Ethnic Collection</div>
                <div className="text-sm text-gray-600">Traditional designs</div>
              </Link>
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Still need help finding what you're looking for?
            </p>
            <Button asChild variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <Link href="/contact">
                Contact our support team
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}