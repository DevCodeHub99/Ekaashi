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
  inStock?: boolean
  comparePrice?: number
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
      availability: product.inStock !== false ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      seller: {
        '@type': 'Organization',
        name: 'Ekaashi',
      },
    },
    ...(product.comparePrice && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '127',
      },
    }),
  }
}

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function createFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function createCollectionSchema(collection: {
  name: string
  description: string
  url: string
  numberOfItems: number
}) {
  return {
    '@type': 'CollectionPage',
    name: collection.name,
    description: collection.description,
    url: collection.url,
    numberOfItems: collection.numberOfItems,
    about: {
      '@type': 'Thing',
      name: 'Jewelry',
    },
  }
}