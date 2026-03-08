import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="text-9xl font-bold text-amber-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/category/earrings" className="p-4 border border-gray-200 rounded-lg hover:border-amber-600 hover:shadow-md transition-all">
              <div className="text-3xl mb-2">💎</div>
              <div className="font-medium text-gray-900">Earrings</div>
            </Link>
            <Link href="/category/necklaces" className="p-4 border border-gray-200 rounded-lg hover:border-amber-600 hover:shadow-md transition-all">
              <div className="text-3xl mb-2">📿</div>
              <div className="font-medium text-gray-900">Necklaces</div>
            </Link>
            <Link href="/category/rings" className="p-4 border border-gray-200 rounded-lg hover:border-amber-600 hover:shadow-md transition-all">
              <div className="text-3xl mb-2">💍</div>
              <div className="font-medium text-gray-900">Rings</div>
            </Link>
            <Link href="/category/bracelets" className="p-4 border border-gray-200 rounded-lg hover:border-amber-600 hover:shadow-md transition-all">
              <div className="text-3xl mb-2">⚜️</div>
              <div className="font-medium text-gray-900">Bracelets</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
