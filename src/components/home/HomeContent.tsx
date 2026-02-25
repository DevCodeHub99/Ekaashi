'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, Shield, Truck, HeartHandshake } from "lucide-react"
import Carousel from "@/components/ui/carousel"
import ProductGrid from "@/components/products/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import InstagramFeed from "@/components/home/InstagramFeed"
import PullToRefresh from "@/components/ui/pull-to-refresh"
import { useState } from "react"

export default function HomeContent() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleRefresh = async () => {
    // Wait a bit to simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Force re-render of product grids
    setRefreshKey(prev => prev + 1)
  }

  return (
    <PullToRefresh onRefresh={handleRefresh} enabled={typeof window !== 'undefined' && window.innerWidth < 768}>
      <div className="flex flex-col">
        {/* Hero Carousel Section */}
        <section className="container mx-auto px-4 py-6">
          <Carousel />
        </section>

        {/* New Arrivals Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                  New <span className="font-semibold">Arrivals</span>
                </h2>
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
                Discover the latest additions to our exquisite jewelry collection
              </p>
            </div>

            <ProductGrid 
              key={`new-arrivals-${refreshKey}`}
              endpoint="/api/products/new-arrivals"
              limit={4}
            />

            <div className="text-center mt-8">
              <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-none font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                <Link href="/new-arrivals">
                  VIEW ALL NEW ARRIVALS
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-amber-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                  Shop by <span className="font-semibold">Collection</span>
                </h2>
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
                Explore our curated collections designed for every occasion
              </p>
            </div>

            <CategoryGrid />
          </div>
        </section>

        {/* Deals Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="w-12 sm:w-16 h-0.5 bg-red-600 mx-auto mb-4"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                  Special <span className="font-semibold text-red-600">Deals</span>
                </h2>
                <div className="w-12 sm:w-16 h-0.5 bg-red-600 mx-auto mt-4"></div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
                Limited time offers on selected pieces
              </p>
            </div>

            <ProductGrid 
              key={`deals-${refreshKey}`}
              endpoint="/api/products/deals"
              limit={4}
            />

            <div className="text-center mt-8">
              <Button asChild className="bg-red-600 hover:bg-red-700 text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-none font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                <Link href="/deals">
                  VIEW ALL DEALS
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-block mb-4">
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                  Featured <span className="font-semibold">Masterpieces</span>
                </h2>
                <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
              </div>
              <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
                Handpicked selections showcasing exceptional craftsmanship
              </p>
            </div>

            <ProductGrid 
              key={`featured-${refreshKey}`}
              endpoint="/api/products/featured"
              limit={8}
            />
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 sm:py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-amber-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Lifetime Warranty</h3>
                <p className="text-sm text-gray-600">Full protection on all jewelry</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Truck className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Free Shipping</h3>
                <p className="text-sm text-gray-600">On orders over ₹5,000</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <HeartHandshake className="h-7 w-7 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-7 w-7 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-sm text-gray-600">Certified authentic jewelry</p>
              </div>
            </div>
          </div>
        </section>

        {/* Instagram Feed */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <InstagramFeed />
          </div>
        </section>
      </div>
    </PullToRefresh>
  )
}
