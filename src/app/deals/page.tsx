import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ui/product-card'

export const metadata: Metadata = {
  title: 'Deals & Offers - Ekaashi',
  description: 'Discover amazing deals and special offers on our beautiful jewelry collection. Limited time discounts on earrings, necklaces, and jewelry sets.',
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
    return []
  }
}

export default async function DealsPage() {
  const dealsProducts = await getDealsProducts()

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
          <option>Sort by Discount</option>
          <option>Highest Discount</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {dealsProducts.length > 0 ? (
          dealsProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <div className="text-6xl mb-4">🔥</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Deals Available</h3>
            <p className="text-gray-600">Check back soon for amazing deals and offers!</p>
          </div>
        )}
      </div>
    </div>
  )
}