import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('Starting MongoDB database seeding...')

    // Test connection
    await prisma.$connect()
    console.log('MongoDB connected successfully')

    // Create admin user
    const bcrypt = await import('bcryptjs')
    const adminPassword = await bcrypt.hash('admin123', 12)

    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@ekaashi.com' },
      update: {},
      create: {
        name: 'Admin',
        email: 'admin@ekaashi.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    })
    console.log('Admin user created:', adminUser.id)

    // Create categories
    const categories = [
      { name: 'Party Wear Earrings', slug: 'party-wear-earrings', description: 'Elegant earrings for special occasions' },
      { name: 'Ethnic Earrings', slug: 'ethnic-earrings', description: 'Traditional and cultural earring designs' },
      { name: 'Casual Earrings', slug: 'casual-earrings', description: 'Everyday wear earrings' },
      { name: 'Casual Necklace', slug: 'casual-necklace', description: 'Stylish necklaces for daily wear' },
      { name: 'Jewelry Set', slug: 'jewelry-set', description: 'Complete jewelry sets' }
    ]

    const createdCategories = []
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat
      })
      createdCategories.push(category)
      console.log('Category created:', category.name)
    }

    // Create products - 5 per category
    const products = [
      // Party Wear Earrings (5 products)
      {
        name: 'Golden Elegance Earrings',
        slug: 'golden-elegance-earrings',
        description: 'Beautiful golden earrings perfect for special occasions and parties',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Golden Elegance Earrings - Party Wear Jewelry',
        seoDescription: 'Stunning golden earrings perfect for parties and special occasions'
      },
      {
        name: 'Crystal Drop Earrings',
        slug: 'crystal-drop-earrings',
        description: 'Sparkling crystal drop earrings that add glamour to any party outfit',
        price: 3499,
        comparePrice: 4999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Crystal Drop Earrings - Party Jewelry',
        seoDescription: 'Glamorous crystal drop earrings for special events'
      },
      {
        name: 'Ruby Chandelier Earrings',
        slug: 'ruby-chandelier-earrings',
        description: 'Exquisite ruby chandelier earrings for grand celebrations',
        price: 5999,
        comparePrice: 7999,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: false,
        inStock: true,
        seoTitle: 'Ruby Chandelier Earrings - Luxury Party Wear',
        seoDescription: 'Stunning ruby chandelier earrings for grand occasions'
      },
      {
        name: 'Emerald Statement Earrings',
        slug: 'emerald-statement-earrings',
        description: 'Bold emerald statement earrings that make you stand out',
        price: 4499,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: false,
        inStock: true,
        seoTitle: 'Emerald Statement Earrings - Party Wear',
        seoDescription: 'Bold and beautiful emerald earrings for parties'
      },
      {
        name: 'Pearl Cluster Earrings',
        slug: 'pearl-cluster-earrings',
        description: 'Elegant pearl cluster earrings for sophisticated evening events',
        price: 3999,
        comparePrice: 5499,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Pearl Cluster Earrings - Evening Wear',
        seoDescription: 'Sophisticated pearl cluster earrings for elegant events'
      },

      // Ethnic Earrings (5 products)
      {
        name: 'Traditional Jhumka Earrings',
        slug: 'traditional-jhumka-earrings',
        description: 'Classic Indian jhumka earrings with intricate designs',
        price: 1999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: true,
        inStock: true,
        seoTitle: 'Traditional Jhumka Earrings - Ethnic Jewelry',
        seoDescription: 'Authentic traditional jhumka earrings with beautiful craftsmanship'
      },
      {
        name: 'Kundan Chandbali Earrings',
        slug: 'kundan-chandbali-earrings',
        description: 'Exquisite kundan chandbali earrings with traditional craftsmanship',
        price: 2499,
        comparePrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: true,
        inStock: true,
        seoTitle: 'Kundan Chandbali Earrings - Traditional Jewelry',
        seoDescription: 'Beautiful kundan chandbali earrings for ethnic occasions'
      },
      {
        name: 'Temple Jewelry Earrings',
        slug: 'temple-jewelry-earrings',
        description: 'Sacred temple jewelry earrings with divine motifs',
        price: 2999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: false,
        inStock: true,
        seoTitle: 'Temple Jewelry Earrings - Sacred Designs',
        seoDescription: 'Divine temple jewelry earrings with traditional motifs'
      },
      {
        name: 'Meenakari Jhumka',
        slug: 'meenakari-jhumka',
        description: 'Colorful meenakari jhumka with vibrant enamel work',
        price: 2199,
        comparePrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: false,
        inStock: true,
        seoTitle: 'Meenakari Jhumka - Colorful Ethnic Earrings',
        seoDescription: 'Vibrant meenakari jhumka with beautiful enamel work'
      },
      {
        name: 'Antique Gold Earrings',
        slug: 'antique-gold-earrings',
        description: 'Vintage-inspired antique gold earrings with ethnic charm',
        price: 1799,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[1].id,
        featured: true,
        inStock: true,
        seoTitle: 'Antique Gold Earrings - Vintage Ethnic Jewelry',
        seoDescription: 'Beautiful antique gold earrings with traditional appeal'
      },

      // Casual Earrings (5 products)
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        description: 'Simple yet elegant diamond stud earrings for everyday wear',
        price: 3499,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: true,
        inStock: true,
        seoTitle: 'Diamond Stud Earrings - Casual Jewelry',
        seoDescription: 'Elegant diamond stud earrings perfect for daily wear'
      },
      {
        name: 'Silver Hoop Earrings',
        slug: 'silver-hoop-earrings',
        description: 'Classic silver hoop earrings for everyday style',
        price: 1299,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: false,
        inStock: true,
        seoTitle: 'Silver Hoop Earrings - Daily Wear',
        seoDescription: 'Stylish silver hoop earrings for everyday fashion'
      },
      {
        name: 'Rose Gold Studs',
        slug: 'rose-gold-studs',
        description: 'Delicate rose gold stud earrings for a subtle look',
        price: 1599,
        comparePrice: 2199,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: true,
        inStock: true,
        seoTitle: 'Rose Gold Studs - Minimalist Earrings',
        seoDescription: 'Elegant rose gold stud earrings for daily wear'
      },
      {
        name: 'Geometric Drop Earrings',
        slug: 'geometric-drop-earrings',
        description: 'Modern geometric drop earrings for contemporary style',
        price: 1899,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: false,
        inStock: true,
        seoTitle: 'Geometric Drop Earrings - Modern Casual',
        seoDescription: 'Trendy geometric earrings for everyday wear'
      },
      {
        name: 'Pearl Stud Earrings',
        slug: 'pearl-stud-earrings',
        description: 'Timeless pearl stud earrings for classic elegance',
        price: 2299,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
        ],
        categoryId: createdCategories[2].id,
        featured: true,
        inStock: true,
        seoTitle: 'Pearl Stud Earrings - Classic Daily Wear',
        seoDescription: 'Elegant pearl stud earrings for everyday elegance'
      },

      // Casual Necklace (5 products)
      {
        name: 'Silver Pearl Necklace',
        slug: 'silver-pearl-necklace',
        description: 'Elegant silver necklace with beautiful pearls for a sophisticated look',
        price: 4999,
        comparePrice: 6999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: true,
        inStock: true,
        seoTitle: 'Silver Pearl Necklace - Elegant Jewelry',
        seoDescription: 'Beautiful silver necklace with pearls for elegant occasions'
      },
      {
        name: 'Gold Chain Necklace',
        slug: 'gold-chain-necklace',
        description: 'Simple gold chain necklace perfect for layering',
        price: 3499,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: false,
        inStock: true,
        seoTitle: 'Gold Chain Necklace - Minimalist Jewelry',
        seoDescription: 'Elegant gold chain necklace for everyday wear'
      },
      {
        name: 'Pendant Necklace',
        slug: 'pendant-necklace',
        description: 'Delicate pendant necklace with heart charm',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: true,
        inStock: true,
        seoTitle: 'Pendant Necklace - Heart Charm Jewelry',
        seoDescription: 'Beautiful pendant necklace with heart charm'
      },
      {
        name: 'Layered Chain Necklace',
        slug: 'layered-chain-necklace',
        description: 'Trendy layered chain necklace for modern style',
        price: 3799,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: false,
        inStock: true,
        seoTitle: 'Layered Chain Necklace - Trendy Jewelry',
        seoDescription: 'Stylish layered chain necklace for contemporary look'
      },
      {
        name: 'Bar Necklace',
        slug: 'bar-necklace',
        description: 'Minimalist bar necklace for subtle elegance',
        price: 2499,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[3].id,
        featured: true,
        inStock: true,
        seoTitle: 'Bar Necklace - Minimalist Jewelry',
        seoDescription: 'Elegant bar necklace for everyday sophistication'
      },

      // Jewelry Set (5 products)
      {
        name: 'Bridal Jewelry Set',
        slug: 'bridal-jewelry-set',
        description: 'Complete bridal jewelry set with necklace, earrings, and maang tikka',
        price: 15999,
        comparePrice: 19999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: true,
        inStock: true,
        seoTitle: 'Bridal Jewelry Set - Complete Wedding Collection',
        seoDescription: 'Stunning bridal jewelry set perfect for weddings and special occasions'
      },
      {
        name: 'Party Wear Jewelry Set',
        slug: 'party-wear-jewelry-set',
        description: 'Glamorous jewelry set with necklace and earrings for parties',
        price: 8999,
        comparePrice: 11999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: true,
        inStock: true,
        seoTitle: 'Party Wear Jewelry Set - Glamorous Collection',
        seoDescription: 'Beautiful jewelry set for parties and celebrations'
      },
      {
        name: 'Traditional Jewelry Set',
        slug: 'traditional-jewelry-set',
        description: 'Ethnic jewelry set with necklace, earrings, and bangles',
        price: 12999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: false,
        inStock: true,
        seoTitle: 'Traditional Jewelry Set - Ethnic Collection',
        seoDescription: 'Complete traditional jewelry set for ethnic occasions'
      },
      {
        name: 'Pearl Jewelry Set',
        slug: 'pearl-jewelry-set',
        description: 'Elegant pearl jewelry set with necklace and earrings',
        price: 9999,
        comparePrice: 12999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: true,
        inStock: true,
        seoTitle: 'Pearl Jewelry Set - Elegant Collection',
        seoDescription: 'Beautiful pearl jewelry set for sophisticated occasions'
      },
      {
        name: 'Diamond Jewelry Set',
        slug: 'diamond-jewelry-set',
        description: 'Luxurious diamond jewelry set with necklace, earrings, and bracelet',
        price: 24999,
        comparePrice: 29999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
        ],
        categoryId: createdCategories[4].id,
        featured: true,
        inStock: true,
        seoTitle: 'Diamond Jewelry Set - Luxury Collection',
        seoDescription: 'Exquisite diamond jewelry set for special occasions'
      }
    ]

    for (const product of products) {
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product
      })
      console.log('Product created:', createdProduct.name)
    }

    // Create banners
    const banners = [
      {
        title: 'Welcome to Ekaashi',
        subtitle: 'Discover Exquisite Jewelry Collection',
        description: 'Handcrafted jewelry pieces that celebrate your unique style',
        buttonText: 'Shop Now',
        buttonLink: '/products',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200',
        isActive: true,
        order: 1
      },
      {
        title: 'New Arrivals',
        subtitle: 'Latest Jewelry Trends',
        description: 'Explore our newest collection of stunning jewelry pieces',
        buttonText: 'View Collection',
        buttonLink: '/new-arrivals',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200',
        isActive: true,
        order: 2
      }
    ]

    for (const banner of banners) {
      const createdBanner = await prisma.banner.create({
        data: banner
      })
      console.log('Banner created:', createdBanner.title)
    }

    await prisma.$disconnect()

    const counts = {
      users: await prisma.user.count(),
      categories: await prisma.category.count(),
      products: await prisma.product.count(),
      banners: await prisma.banner.count()
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB database seeded successfully',
      counts,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('MongoDB seeding failed:', error)
    
    return NextResponse.json({
      error: 'MongoDB seeding failed',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}