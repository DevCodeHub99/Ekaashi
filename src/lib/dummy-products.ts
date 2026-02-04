export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  inStock: boolean
  featured: boolean
}

export const dummyProducts: Product[] = [
  // Party Wear Earrings
  {
    id: '1',
    name: 'Diamond Chandelier Earrings',
    slug: 'diamond-chandelier-earrings',
    description: 'Stunning chandelier earrings with sparkling crystals, perfect for weddings and special occasions.',
    price: 299.99,
    comparePrice: 399.99,
    images: ['/images/party-earrings-1.jpg'],
    category: 'party-wear-earrings',
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Pearl Drop Statement Earrings',
    slug: 'pearl-drop-statement-earrings',
    description: 'Elegant pearl drop earrings that make a statement at any formal event.',
    price: 199.99,
    images: ['/images/party-earrings-2.jpg'],
    category: 'party-wear-earrings',
    inStock: true,
    featured: false
  },
  {
    id: '3',
    name: 'Crystal Cluster Earrings',
    slug: 'crystal-cluster-earrings',
    description: 'Glamorous crystal cluster earrings that catch the light beautifully.',
    price: 149.99,
    images: ['/images/party-earrings-3.jpg'],
    category: 'party-wear-earrings',
    inStock: true,
    featured: false
  },

  // Ethnic Earrings
  {
    id: '4',
    name: 'Traditional Jhumka Earrings',
    slug: 'traditional-jhumka-earrings',
    description: 'Classic Indian jhumka earrings with intricate gold-plated designs.',
    price: 89.99,
    images: ['/images/ethnic-earrings-1.jpg'],
    category: 'ethnic-earrings',
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Kundan Chandbali Earrings',
    slug: 'kundan-chandbali-earrings',
    description: 'Beautiful kundan chandbali earrings with traditional craftsmanship.',
    price: 159.99,
    comparePrice: 199.99,
    images: ['/images/ethnic-earrings-2.jpg'],
    category: 'ethnic-earrings',
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Oxidized Silver Tribal Earrings',
    slug: 'oxidized-silver-tribal-earrings',
    description: 'Unique tribal design earrings with oxidized silver finish.',
    price: 69.99,
    images: ['/images/ethnic-earrings-3.jpg'],
    category: 'ethnic-earrings',
    inStock: true,
    featured: false
  },

  // Casual Earrings
  {
    id: '7',
    name: 'Minimalist Stud Earrings',
    slug: 'minimalist-stud-earrings',
    description: 'Simple and elegant stud earrings perfect for everyday wear.',
    price: 39.99,
    images: ['/images/casual-earrings-1.jpg'],
    category: 'casual-earrings',
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Delicate Hoop Earrings',
    slug: 'delicate-hoop-earrings',
    description: 'Lightweight hoop earrings that add a touch of elegance to any outfit.',
    price: 49.99,
    images: ['/images/casual-earrings-2.jpg'],
    category: 'casual-earrings',
    inStock: true,
    featured: false
  },
  {
    id: '9',
    name: 'Geometric Drop Earrings',
    slug: 'geometric-drop-earrings',
    description: 'Modern geometric design earrings for the contemporary woman.',
    price: 59.99,
    images: ['/images/casual-earrings-3.jpg'],
    category: 'casual-earrings',
    inStock: true,
    featured: false
  },

  // Casual Necklace
  {
    id: '10',
    name: 'Layered Chain Necklace',
    slug: 'layered-chain-necklace',
    description: 'Trendy layered chain necklace that adds dimension to any look.',
    price: 79.99,
    comparePrice: 99.99,
    images: ['/images/casual-necklace-1.jpg'],
    category: 'casual-necklace',
    inStock: true,
    featured: true
  },
  {
    id: '11',
    name: 'Pendant Heart Necklace',
    slug: 'pendant-heart-necklace',
    description: 'Sweet heart pendant necklace perfect for daily wear.',
    price: 69.99,
    images: ['/images/casual-necklace-2.jpg'],
    category: 'casual-necklace',
    inStock: true,
    featured: false
  },
  {
    id: '12',
    name: 'Bar Chain Necklace',
    slug: 'bar-chain-necklace',
    description: 'Sleek bar chain necklace with minimalist design.',
    price: 89.99,
    images: ['/images/casual-necklace-3.jpg'],
    category: 'casual-necklace',
    inStock: true,
    featured: false
  },

  // Jewelry Set
  {
    id: '13',
    name: 'Bridal Pearl Set',
    slug: 'bridal-pearl-set',
    description: 'Complete bridal set with pearl necklace and matching earrings.',
    price: 399.99,
    comparePrice: 499.99,
    images: ['/images/jewelry-set-1.jpg'],
    category: 'jewelry-set',
    inStock: true,
    featured: true
  },
  {
    id: '14',
    name: 'Gold Plated Jewelry Set',
    slug: 'gold-plated-jewelry-set',
    description: 'Elegant gold-plated necklace and earring set for special occasions.',
    price: 249.99,
    images: ['/images/jewelry-set-2.jpg'],
    category: 'jewelry-set',
    inStock: true,
    featured: false
  },
  {
    id: '15',
    name: 'Crystal Jewelry Set',
    slug: 'crystal-jewelry-set',
    description: 'Sparkling crystal necklace and earring set that catches the light.',
    price: 179.99,
    images: ['/images/jewelry-set-3.jpg'],
    category: 'jewelry-set',
    inStock: true,
    featured: false
  }
]

export function getProductsByCategory(category: string): Product[] {
  return dummyProducts.filter(product => product.category === category)
}

export function getFeaturedProducts(): Product[] {
  return dummyProducts.filter(product => product.featured)
}

export function getAllProducts(): Product[] {
  return dummyProducts
}

export function getProductBySlug(slug: string): Product | undefined {
  return dummyProducts.find(product => product.slug === slug)
}