import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/ui/product-card'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

const categories = {
  'party-wear-earrings': {
    name: 'Party Wear Earrings',
    description: 'Glamorous earrings perfect for parties, weddings, and special occasions.',
    emoji: '✨'
  },
  'ethnic-earrings': {
    name: 'Ethnic Earrings',
    description: 'Traditional and cultural designs that celebrate heritage with modern appeal.',
    emoji: '🌸'
  },
  'casual-earrings': {
    name: 'Casual Earrings',
    description: 'Everyday elegance with comfortable and stylish designs for daily wear.',
    emoji: '💫'
  },
  'casual-necklace': {
    name: 'Casual Necklace',
    description: 'Delicate and versatile necklaces perfect for everyday styling.',
    emoji: '📿'
  },
  'jewelry-set': {
    name: 'Jewelry Set',
    description: 'Complete coordinated collections of matching earrings and necklaces.',
    emoji: '💎'
  }
}

async function getProductsByCategory(categorySlug: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug
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
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = categories[slug as keyof typeof categories]
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} - Ekaashi`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const category = categories[slug as keyof typeof categories]

  if (!category) {
    notFound()
  }

  const products = await getProductsByCategory(slug)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="text-6xl mb-4">{category.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{category.name}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">{category.description}</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>All Styles</option>
          <option>Classic</option>
          <option>Modern</option>
          <option>Vintage</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg">
          <option>Sort by</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest First</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="text-center py-12 col-span-full">
            <div className="text-6xl mb-4">{category.emoji}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No {category.name} Yet</h3>
            <p className="text-gray-600">{category.name} will appear here once added by the admin.</p>
          </div>
        )}
      </div>
    </div>
  )
}