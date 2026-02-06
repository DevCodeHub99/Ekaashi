import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import ProductPageClient from './client'
import { notFound } from 'next/navigation'

// ISR: Revalidate every 60 seconds
export const revalidate = 60

interface ProductPageProps {
  params: {
    slug: string
  }
}

async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true
      }
    })

    if (!product) return null

    return {
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
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Generate metadata for SEO (Server Component)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)

  if (!product) {
    return {
      title: 'Product Not Found - Ekaashi',
      description: 'The requested product could not be found.',
    }
  }

  const productTitle = `${product.name} - Ekaashi`
  const productDescription = `${product.description} Available for ${formatPrice(product.price)}${product.comparePrice ? ` (was ${formatPrice(product.comparePrice)})` : ''}. Free shipping and lifetime warranty included.`

  return {
    title: productTitle,
    description: productDescription,
    keywords: `${product.name}, ${product.category.replace('-', ' ')}, ekaashi jewelry, handcrafted jewelry, premium jewelry`,
    openGraph: {
      title: productTitle,
      description: productDescription,
      type: 'website',
      siteName: 'Ekaashi',
      images: product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: productTitle,
      description: productDescription,
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  }
}

async function getRelatedProducts(categorySlug: string, currentProductId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug
        },
        inStock: true,
        id: {
          not: currentProductId
        }
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
    console.error('Error fetching related products:', error)
    return []
  }
}

// Server Component that passes data to Client Component
export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const product = await getProductBySlug(resolvedParams.slug)
  
  if (!product) {
    notFound()
  }
  
  const relatedProducts = await getRelatedProducts(product.category, product.id)
  
  return <ProductPageClient product={product} relatedProducts={relatedProducts} />
}