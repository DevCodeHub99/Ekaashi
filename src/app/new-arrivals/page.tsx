import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ui/product-card'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'New Arrivals - Ekaashi',
  description: 'Discover the latest additions to our jewelry collection. Fresh designs in earrings, necklaces, and jewelry sets.',
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
      take: 12,
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
    return []
  }
}

export default async function NewArrivalsPage() {
  const newArrivals = await getNewArrivals()

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

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>All Categories</option>
          <option>Party Wear Earrings</option>
          <option>Ethnic Earrings</option>
          <option>Casual Earrings</option>
          <option>Casual Necklace</option>
          <option>Jewelry Set</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>Sort by</option>
          <option>Newest First</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

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