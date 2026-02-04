interface StructuredDataProps {
  data: object
}

export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          ...data,
        }),
      }}
    />
  )
}

// Predefined structured data for common use cases
export const organizationSchema = {
  '@type': 'Organization',
  name: 'Ekaashi',
  description: 'Exquisite handcrafted jewelry including party wear earrings, ethnic earrings, casual necklaces, and jewelry sets',
  url: 'https://ekaashi.com',
  logo: 'https://ekaashi.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'customer service',
  },
  sameAs: [
    'https://facebook.com/ekaashi',
    'https://instagram.com/ekaashi',
    'https://twitter.com/ekaashi',
  ],
}

export const websiteSchema = {
  '@type': 'WebSite',
  name: 'Ekaashi',
  url: 'https://ekaashi.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://ekaashi.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export function createProductSchema(product: {
  name: string
  description: string
  price: number
  images: string[]
  category: string
}) {
  return {
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Ekaashi',
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Ekaashi',
      },
    },
  }
}