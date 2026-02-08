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

    // Create products - 5 per category with high-quality images
    const products = [
      // Party Wear Earrings (5 products)
      {
        name: 'Golden Elegance Drop Earrings',
        slug: 'golden-elegance-drop-earrings',
        description: 'Stunning golden drop earrings with intricate detailing, perfect for weddings and grand celebrations',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Golden Elegance Drop Earrings - Party Wear Jewelry',
        seoDescription: 'Exquisite golden drop earrings perfect for parties and special occasions'
      },
      {
        name: 'Crystal Chandelier Earrings',
        slug: 'crystal-chandelier-earrings',
        description: 'Sparkling crystal chandelier earrings that add glamour and sophistication to any party outfit',
        price: 3499,
        comparePrice: 4999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Crystal Chandelier Earrings - Glamorous Party Jewelry',
        seoDescription: 'Dazzling crystal chandelier earrings for special events'
      },
      {
        name: 'Ruby Statement Earrings',
        slug: 'ruby-statement-earrings',
        description: 'Bold ruby statement earrings with gold accents, designed to make you stand out at any celebration',
        price: 5999,
        comparePrice: 7999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        ],
        categoryId: createdCategories[0].id,
        featured: false,
        inStock: true,
        seoTitle: 'Ruby Statement Earrings - Luxury Party Wear',
        seoDescription: 'Stunning ruby statement earrings for grand occasions'
      },
      {
        name: 'Emerald Teardrop Earrings',
        slug: 'emerald-teardrop-earrings',
        description: 'Elegant emerald teardrop earrings with diamond accents, perfect for evening galas',
        price: 4499,
        images: [
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
        ],
        categoryId: createdCategories[0].id,
        featured: false,
        inStock: true,
        seoTitle: 'Emerald Teardrop Earrings - Evening Party Wear',
        seoDescription: 'Elegant emerald earrings for sophisticated events'
      },
      {
        name: 'Pearl Cluster Party Earrings',
        slug: 'pearl-cluster-party-earrings',
        description: 'Luxurious pearl cluster earrings with gold setting, ideal for weddings and formal events',
        price: 3999,
        comparePrice: 5499,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80'
        ],
        categoryId: createdCategories[0].id,
        featured: true,
        inStock: true,
        seoTitle: 'Pearl Cluster Party Earrings - Wedding Jewelry',
        seoDescription: 'Luxurious pearl cluster earrings for elegant events'
      },

      // Ethnic Earrings (5 products)
      {
        name: 'Traditional Jhumka Earrings',
        slug: 'traditional-jhumka-earrings',
        description: 'Classic Indian jhumka earrings with intricate meenakari work and pearl drops',
        price: 1999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'
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
        description: 'Exquisite kundan chandbali earrings with traditional craftsmanship and pearl detailing',
        price: 2499,
        comparePrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
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
        description: 'Sacred temple jewelry earrings with divine motifs and antique gold finish',
        price: 2999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
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
        description: 'Colorful meenakari jhumka with vibrant enamel work and traditional bell shape',
        price: 2199,
        comparePrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ],
        categoryId: createdCategories[1].id,
        featured: false,
        inStock: true,
        seoTitle: 'Meenakari Jhumka - Colorful Ethnic Earrings',
        seoDescription: 'Vibrant meenakari jhumka with beautiful enamel work'
      },
      {
        name: 'Antique Gold Ethnic Earrings',
        slug: 'antique-gold-ethnic-earrings',
        description: 'Vintage-inspired antique gold earrings with ethnic charm and oxidized finish',
        price: 1799,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
        ],
        categoryId: createdCategories[1].id,
        featured: true,
        inStock: true,
        seoTitle: 'Antique Gold Ethnic Earrings - Vintage Jewelry',
        seoDescription: 'Beautiful antique gold earrings with traditional appeal'
      },

      // Casual Earrings (5 products)
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        description: 'Simple yet elegant diamond stud earrings perfect for everyday wear and office',
        price: 3499,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
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
        description: 'Classic silver hoop earrings with polished finish for everyday style',
        price: 1299,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        ],
        categoryId: createdCategories[2].id,
        featured: false,
        inStock: true,
        seoTitle: 'Silver Hoop Earrings - Daily Wear',
        seoDescription: 'Stylish silver hoop earrings for everyday fashion'
      },
      {
        name: 'Rose Gold Minimalist Studs',
        slug: 'rose-gold-minimalist-studs',
        description: 'Delicate rose gold stud earrings with minimalist design for a subtle look',
        price: 1599,
        comparePrice: 2199,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        categoryId: createdCategories[2].id,
        featured: true,
        inStock: true,
        seoTitle: 'Rose Gold Minimalist Studs - Simple Earrings',
        seoDescription: 'Elegant rose gold stud earrings for daily wear'
      },
      {
        name: 'Geometric Drop Earrings',
        slug: 'geometric-drop-earrings',
        description: 'Modern geometric drop earrings with contemporary design for trendy style',
        price: 1899,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
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
        description: 'Timeless pearl stud earrings with classic elegance for any occasion',
        price: 2299,
        images: [
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
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
        description: 'Elegant silver necklace with beautiful freshwater pearls for a sophisticated look',
        price: 4999,
        comparePrice: 6999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
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
        description: 'Simple gold chain necklace with delicate links, perfect for layering',
        price: 3499,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
        ],
        categoryId: createdCategories[3].id,
        featured: false,
        inStock: true,
        seoTitle: 'Gold Chain Necklace - Minimalist Jewelry',
        seoDescription: 'Elegant gold chain necklace for everyday wear'
      },
      {
        name: 'Heart Pendant Necklace',
        slug: 'heart-pendant-necklace',
        description: 'Delicate pendant necklace with heart charm and sparkling stones',
        price: 2999,
        comparePrice: 3999,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        ],
        categoryId: createdCategories[3].id,
        featured: true,
        inStock: true,
        seoTitle: 'Heart Pendant Necklace - Romantic Jewelry',
        seoDescription: 'Beautiful pendant necklace with heart charm'
      },
      {
        name: 'Layered Chain Necklace',
        slug: 'layered-chain-necklace',
        description: 'Trendy layered chain necklace with multiple strands for modern style',
        price: 3799,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
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
        description: 'Minimalist bar necklace with sleek design for subtle elegance',
        price: 2499,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
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
        description: 'Complete bridal jewelry set with necklace, earrings, maang tikka, and bangles',
        price: 15999,
        comparePrice: 19999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
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
        description: 'Glamorous jewelry set with statement necklace and matching earrings for parties',
        price: 8999,
        comparePrice: 11999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
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
        description: 'Ethnic jewelry set with necklace, earrings, and bangles in antique gold',
        price: 12999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
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
        description: 'Elegant pearl jewelry set with necklace and earrings in silver setting',
        price: 9999,
        comparePrice: 12999,
        images: [
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
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
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
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