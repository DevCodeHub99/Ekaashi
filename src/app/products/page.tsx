import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ui/product-card'
import { Metadata } from 'next'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'All Products - Ekaashi Jewelry Collection',
  description: 'Browse our complete collection of handcrafted jewelry including earrings, necklaces, and jewelry sets.',
}

async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
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
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our complete collection of handcrafted jewelry pieces, from elegant earrings to stunning necklaces and complete jewelry sets.
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}