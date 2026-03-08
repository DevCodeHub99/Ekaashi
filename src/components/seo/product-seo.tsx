import { Metadata } from 'next'

interface ProductSEOProps {
  product: {
    name: string
    description: string
    price: number
    comparePrice?: number
    images: string[]
    category: string
    slug: string
    inStock?: boolean
  }
}

export function generateProductMetadata({ product }: ProductSEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ekaashi-com.vercel.app'
  const productUrl = `${baseUrl}/product/${product.slug}`
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  const title = discount > 0
    ? `${product.name} - ${discount}% Off | Ekaashi`
    : `${product.name} | Ekaashi`

  const description = product.description.length > 160
    ? `${product.description.substring(0, 157)}...`
    : product.description

  return {
    title,
    description,
    keywords: [
      product.name,
      product.category,
      'jewelry',
      'handcrafted',
      'ekaashi',
      'buy online',
      ...(discount > 0 ? ['sale', 'discount', 'offer'] : []),
    ],
    openGraph: {
      type: 'website',
      url: productUrl,
      title,
      description,
      images: product.images.map((img) => ({
        url: img,
        width: 800,
        height: 800,
        alt: product.name,
      })),
      siteName: 'Ekaashi',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [product.images[0]],
    },
    alternates: {
      canonical: productUrl,
    },
  }
}
