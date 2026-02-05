import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Shield, Truck, HeartHandshake } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ui/product-card";
import Carousel from "@/components/ui/carousel";

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true
      },
      include: {
        category: true
      },
      take: 8,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name,
      inStock: product.inStock,
      featured: product.featured
    }))
  } catch (error) {
    console.error('Error fetching featured products:', error)
    // Return empty array if database is not available (e.g., during build)
    return []
  }
}

async function getNewArrivals() {
  try {
    const products = await prisma.product.findMany({
      where: {
        inStock: true
      },
      include: {
        category: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name,
      inStock: product.inStock,
      featured: product.featured
    }))
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    // Return empty array if database is not available (e.g., during build)
    return []
  }
}

async function getDealsProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        comparePrice: {
          not: null
        },
        inStock: true
      },
      include: {
        category: true
      },
      take: 4,
      orderBy: {
        createdAt: 'desc'
      }
    })

    return products.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: Number(product.price),
      comparePrice: product.comparePrice ? Number(product.comparePrice) : undefined,
      images: product.images,
      category: product.category.slug,
      categoryName: product.category.name,
      inStock: product.inStock,
      featured: product.featured
    }))
  } catch (error) {
    console.error('Error fetching deals products:', error)
    // Return empty array if database is not available (e.g., during build)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()
  const newArrivals = await getNewArrivals()
  const dealsProducts = await getDealsProducts()

  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section - Right after header */}
      <section className="container mx-auto px-4 py-6">
        <Carousel />
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                New <span className="font-semibold">Arrivals</span>
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
              Discover the latest additions to our exquisite jewelry collection, featuring contemporary designs and timeless elegance
            </p>
          </div>

          {/* New Arrivals Grid - 2 products per row on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All New Arrivals Button */}
          <div className="text-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-none font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              <Link href="/new-arrivals">
                VIEW ALL NEW ARRIVALS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Category Navigation */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50/30">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                Discover Our <span className="font-semibold">Collections</span>
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
              Explore our carefully curated jewelry collections, each piece designed to celebrate your unique style and special moments
            </p>
          </div>

          {/* Mobile: Horizontal Scrollable Carousel */}
          <div className="block lg:hidden relative">
            <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 px-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {/* Party Wear Earrings */}
              <Link href="/category/party-wear-earrings" className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-center text-white">
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">✨</div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1">Party Wear Earrings</h3>
                      <p className="text-xs opacity-90">Glamorous Occasions</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>

              {/* Ethnic Earrings */}
              <Link href="/category/ethnic-earrings" className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-center text-white">
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">🌸</div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1">Ethnic Earrings</h3>
                      <p className="text-xs opacity-90">Traditional Beauty</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>

              {/* Casual Earrings */}
              <Link href="/category/casual-earrings" className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-center text-white">
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">🍃</div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1">Casual Earrings</h3>
                      <p className="text-xs opacity-90">Everyday Elegance</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>

              {/* Casual Necklace */}
              <Link href="/category/casual-necklace" className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-center text-white">
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">📿</div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1">Casual Necklace</h3>
                      <p className="text-xs opacity-90">Subtle Sophistication</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>

              {/* Jewelry Set */}
              <Link href="/category/jewelry-set" className="group flex-shrink-0 w-40 sm:w-48 cursor-pointer">
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
                    <div className="text-center text-white">
                      <div className="text-2xl sm:text-3xl mb-2 opacity-90">💍</div>
                      <h3 className="text-xs sm:text-sm font-semibold mb-1">Jewelry Set</h3>
                      <p className="text-xs opacity-90">Complete Collections</p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs">→</span>
                  </div>
                </div>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <span className="text-xs">Swipe to explore</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden lg:grid grid-cols-5 gap-6">
            {/* Party Wear Earrings */}
            <Link href="/category/party-wear-earrings" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 opacity-90">✨</div>
                    <h3 className="text-lg font-semibold mb-1">Party Wear Earrings</h3>
                    <p className="text-sm opacity-90">Glamorous Occasions</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>

            {/* Ethnic Earrings */}
            <Link href="/category/ethnic-earrings" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 opacity-90">🌸</div>
                    <h3 className="text-lg font-semibold mb-1">Ethnic Earrings</h3>
                    <p className="text-sm opacity-90">Traditional Beauty</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>

            {/* Casual Earrings */}
            <Link href="/category/casual-earrings" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 opacity-90">🍃</div>
                    <h3 className="text-lg font-semibold mb-1">Casual Earrings</h3>
                    <p className="text-sm opacity-90">Everyday Elegance</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>

            {/* Casual Necklace */}
            <Link href="/category/casual-necklace" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 opacity-90">📿</div>
                    <h3 className="text-lg font-semibold mb-1">Casual Necklace</h3>
                    <p className="text-sm opacity-90">Subtle Sophistication</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>

            {/* Jewelry Set */}
            <Link href="/category/jewelry-set" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-100 to-violet-100 aspect-[4/5] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-3 opacity-90">💍</div>
                    <h3 className="text-lg font-semibold mb-1">Jewelry Set</h3>
                    <p className="text-sm opacity-90">Complete Collections</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm">→</span>
                </div>
              </div>
            </Link>
          </div>

          {/* View All Collections Button */}
          <div className="text-center mt-8 sm:mt-12">
            <Button asChild variant="outline" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white px-6 sm:px-8 py-2 sm:py-3 rounded-none font-medium tracking-wide transition-all duration-300 text-sm sm:text-base">
              <Link href="/products">
                VIEW ALL COLLECTIONS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="w-12 sm:w-16 h-0.5 bg-red-600 mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                Special <span className="font-semibold text-red-600">Deals</span>
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-red-600 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
              Don't miss out on our exclusive offers and limited-time discounts on premium jewelry pieces
            </p>
          </div>

          {/* Compact Deals Banner */}
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-xl p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-center sm:text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl">🔥</div>
                <div className="space-y-1 sm:space-y-2">
                  <div className="inline-block bg-white/20 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full">
                    <span className="text-xs font-bold tracking-wider">LIMITED TIME OFFER</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-light">
                    Up to <span className="font-bold">50% OFF</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/90">
                    On Selected Jewelry Collections
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Floating discount badge */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-xs sm:text-sm">50%</div>
                    <div className="text-red-600 font-bold text-xs">OFF</div>
                  </div>
                </div>
                
                <Button asChild className="bg-white text-red-600 hover:bg-gray-100 px-4 sm:px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
                  <Link href="/deals">
                    SHOP DEALS NOW
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Deal Products Grid - Show products with comparePrice (sale items) - 2 products per row on mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {dealsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* View All Deals Button */}
          <div className="text-center">
            <Button asChild className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 sm:px-8 lg:px-10 py-2 sm:py-3 rounded-none font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              <Link href="/deals">
                VIEW ALL DEALS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="w-20 h-0.5 bg-amber-600 mx-auto mb-6"></div>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 mb-4 tracking-wide">
                Featured <span className="font-semibold">Masterpieces</span>
              </h2>
              <div className="w-20 h-0.5 bg-amber-600 mx-auto"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Discover our most coveted pieces, each one a testament to exceptional craftsmanship and timeless beauty
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-12 py-4 rounded-none font-medium text-lg tracking-wide shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/products">
                EXPLORE FULL COLLECTION
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Premium Trust Indicators */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 mb-4 tracking-wide px-4">
              The <span className="font-semibold">Ekaashi Promise</span>
            </h2>
            <div className="w-16 sm:w-20 h-0.5 bg-amber-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center group">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Lifetime Warranty</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">Comprehensive protection for your precious investment</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Truck className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Secure Delivery</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">Insured shipping with real-time tracking</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <HeartHandshake className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">Easy Returns</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">Hassle-free 30-day return policy</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Star className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">5-Star Reviews</h3>
              <p className="text-gray-600 font-light leading-relaxed text-sm sm:text-base">Trusted by thousands of happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                What Our <span className="font-semibold">Customers Say</span>
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
              Hear from our satisfied customers about their experience with Ekaashi jewelry
            </p>
          </div>

          {/* Mobile: Horizontal Scrollable Carousel */}
          <div className="block md:hidden relative mb-8">
            <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4 px-2" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {/* Review 1 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "Absolutely stunning jewelry! The quality is exceptional and the designs are so elegant. I've received countless compliments on my earrings."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-amber-600 font-semibold text-sm">S</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Sarah Johnson</h4>
                    <p className="text-xs text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>

              {/* Review 2 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "Perfect for my wedding! The jewelry set was exactly what I was looking for. Beautiful craftsmanship and arrived perfectly packaged."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-rose-600 font-semibold text-sm">P</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Priya Sharma</h4>
                    <p className="text-xs text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>

              {/* Review 3 */}
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0 w-80">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-sm">
                  "Great value for money! The ethnic earrings are gorgeous and the customer service was excellent. Will definitely shop again."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold text-sm">A</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Anita Patel</h4>
                    <p className="text-xs text-gray-500">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex items-center space-x-2 text-amber-600">
                <span className="text-xs">Swipe to read more</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Desktop: Grid Layout */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Review 1 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                "Absolutely stunning jewelry! The quality is exceptional and the designs are so elegant. I've received countless compliments on my earrings."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-amber-600 font-semibold text-sm sm:text-base">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Sarah Johnson</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                "Perfect for my wedding! The jewelry set was exactly what I was looking for. Beautiful craftsmanship and arrived perfectly packaged."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-rose-600 font-semibold text-sm sm:text-base">P</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Priya Sharma</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed text-sm sm:text-base">
                "Great value for money! The ethnic earrings are gorgeous and the customer service was excellent. Will definitely shop again."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-green-600 font-semibold text-sm sm:text-base">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Anita Patel</h4>
                  <p className="text-xs sm:text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Button asChild variant="outline" className="border-2 border-amber-600 text-amber-700 hover:bg-amber-600 hover:text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium tracking-wide transition-all duration-300 text-sm sm:text-base">
              <Link href="/reviews">
                READ MORE REVIEWS
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block mb-4">
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mb-4"></div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-wide px-4">
                Follow Us on <span className="font-semibold text-pink-600">Instagram</span>
              </h2>
              <div className="w-12 sm:w-16 h-0.5 bg-amber-600 mx-auto mt-4"></div>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto font-light leading-relaxed text-sm sm:text-base px-4">
              Get inspired by our community and see how our customers style their Ekaashi jewelry
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4 mb-8 sm:mb-12">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="text-2xl sm:text-3xl lg:text-4xl opacity-60 group-hover:opacity-80 transition-opacity">💎</div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base">
              <Link href="https://instagram.com/ekaashi" target="_blank">
                FOLLOW @EKAASHI
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}