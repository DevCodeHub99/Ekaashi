const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedAllCategories() {
  try {
    console.log('🌱 Starting complete category and product seeding...\n')

    // Define all categories from the image
    const categories = [
      { 
        name: 'Party Wear Earrings', 
        slug: 'party-wear-earrings', 
        description: 'Glamorous earrings perfect for parties, weddings, and special occasions',
        isActive: true,
        order: 1
      },
      { 
        name: 'Ethnic Earrings', 
        slug: 'ethnic-earrings', 
        description: 'Traditional and cultural designs that celebrate heritage with modern appeal',
        isActive: true,
        order: 2
      },
      { 
        name: 'Casual Earrings', 
        slug: 'casual-earrings', 
        description: 'Everyday elegance with comfortable and stylish designs for daily wear',
        isActive: true,
        order: 3
      },
      { 
        name: 'Casual Necklace', 
        slug: 'casual-necklace', 
        description: 'Delicate and versatile necklaces perfect for everyday styling',
        isActive: true,
        order: 4
      },
      { 
        name: 'Jewelry Set', 
        slug: 'jewelry-set', 
        description: 'Complete coordinated collections of matching jewelry pieces',
        isActive: true,
        order: 5
      }
    ]

    console.log('📁 Creating/Updating Categories...')
    const createdCategories = []
    
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          name: cat.name,
          description: cat.description,
          isActive: cat.isActive,
          order: cat.order
        },
        create: cat
      })
      createdCategories.push(category)
      console.log(`   ✅ ${category.name}`)
    }

    console.log('\n📦 Creating Products (5 per category)...\n')

    // Products for each category
    const allProducts = [
      // Party Wear Earrings (5 products)
      {
        name: 'Golden Elegance Drop Earrings',
        slug: 'golden-elegance-drop-earrings',
        sku: 'PWE-001',
        description: 'Stunning golden drop earrings with intricate detailing, perfect for weddings and grand celebrations',
        price: 5499,
        comparePrice: 7999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        ],
        categorySlug: 'party-wear-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Crystal Chandelier Earrings',
        slug: 'crystal-chandelier-earrings',
        sku: 'PWE-002',
        description: 'Sparkling crystal chandelier earrings that add glamour and sophistication to any party outfit',
        price: 6999,
        comparePrice: 9999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        ],
        categorySlug: 'party-wear-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Ruby Statement Earrings',
        slug: 'ruby-statement-earrings',
        sku: 'PWE-003',
        description: 'Bold ruby statement earrings with gold accents, designed to make you stand out at any celebration',
        price: 8999,
        comparePrice: 11999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        ],
        categorySlug: 'party-wear-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Emerald Teardrop Earrings',
        slug: 'emerald-teardrop-earrings',
        sku: 'PWE-004',
        description: 'Elegant emerald teardrop earrings with diamond accents, perfect for evening galas',
        price: 7499,
        images: [
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
        ],
        categorySlug: 'party-wear-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Pearl Cluster Party Earrings',
        slug: 'pearl-cluster-party-earrings',
        sku: 'PWE-005',
        description: 'Luxurious pearl cluster earrings with gold setting, ideal for weddings and formal events',
        price: 5999,
        comparePrice: 7999,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80'
        ],
        categorySlug: 'party-wear-earrings',
        featured: true,
        inStock: true
      },

      // Ethnic Earrings (5 products)
      {
        name: 'Traditional Jhumka Earrings',
        slug: 'traditional-jhumka-earrings',
        sku: 'ETH-001',
        description: 'Classic Indian jhumka earrings with intricate meenakari work and pearl drops',
        price: 3999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'
        ],
        categorySlug: 'ethnic-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Kundan Chandbali Earrings',
        slug: 'kundan-chandbali-earrings',
        sku: 'ETH-002',
        description: 'Exquisite kundan chandbali earrings with traditional craftsmanship and pearl detailing',
        price: 5499,
        comparePrice: 7499,
        images: [
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
        ],
        categorySlug: 'ethnic-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Temple Jewelry Earrings',
        slug: 'temple-jewelry-earrings',
        sku: 'ETH-003',
        description: 'Sacred temple jewelry earrings with divine motifs and antique gold finish',
        price: 4999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        ],
        categorySlug: 'ethnic-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Meenakari Jhumka',
        slug: 'meenakari-jhumka',
        sku: 'ETH-004',
        description: 'Colorful meenakari jhumka with vibrant enamel work and traditional bell shape',
        price: 4499,
        comparePrice: 5999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ],
        categorySlug: 'ethnic-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Antique Gold Ethnic Earrings',
        slug: 'antique-gold-ethnic-earrings',
        sku: 'ETH-005',
        description: 'Vintage-inspired antique gold earrings with ethnic charm and oxidized finish',
        price: 6499,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
        ],
        categorySlug: 'ethnic-earrings',
        featured: true,
        inStock: true
      },

      // Casual Earrings (5 products)
      {
        name: 'Diamond Stud Earrings',
        slug: 'diamond-stud-earrings',
        sku: 'CAS-001',
        description: 'Simple yet elegant diamond stud earrings perfect for everyday wear and office',
        price: 12999,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
        ],
        categorySlug: 'casual-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Silver Hoop Earrings',
        slug: 'silver-hoop-earrings',
        sku: 'CAS-002',
        description: 'Classic silver hoop earrings with polished finish for everyday style',
        price: 2499,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        ],
        categorySlug: 'casual-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Rose Gold Minimalist Studs',
        slug: 'rose-gold-minimalist-studs',
        sku: 'CAS-003',
        description: 'Delicate rose gold stud earrings with minimalist design for a subtle look',
        price: 3999,
        comparePrice: 5499,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        categorySlug: 'casual-earrings',
        featured: true,
        inStock: true
      },
      {
        name: 'Geometric Drop Earrings',
        slug: 'geometric-drop-earrings',
        sku: 'CAS-004',
        description: 'Modern geometric drop earrings with contemporary design for trendy style',
        price: 2999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
        ],
        categorySlug: 'casual-earrings',
        featured: false,
        inStock: true
      },
      {
        name: 'Pearl Stud Earrings',
        slug: 'pearl-stud-earrings',
        sku: 'CAS-005',
        description: 'Timeless pearl stud earrings with classic elegance for any occasion',
        price: 4499,
        images: [
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
        ],
        categorySlug: 'casual-earrings',
        featured: true,
        inStock: true
      },

      // Casual Necklace (5 products)
      {
        name: 'Silver Pearl Necklace',
        slug: 'silver-pearl-necklace',
        sku: 'NCK-001',
        description: 'Elegant silver necklace with beautiful freshwater pearls for a sophisticated look',
        price: 8999,
        comparePrice: 11999,
        images: [
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ],
        categorySlug: 'casual-necklace',
        featured: true,
        inStock: true
      },
      {
        name: 'Gold Chain Necklace',
        slug: 'gold-chain-necklace',
        sku: 'NCK-002',
        description: 'Simple gold chain necklace with delicate links, perfect for layering',
        price: 15999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
        ],
        categorySlug: 'casual-necklace',
        featured: false,
        inStock: true
      },
      {
        name: 'Heart Pendant Necklace',
        slug: 'heart-pendant-necklace',
        sku: 'NCK-003',
        description: 'Delicate pendant necklace with heart charm and sparkling stones',
        price: 6999,
        comparePrice: 8999,
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        ],
        categorySlug: 'casual-necklace',
        featured: true,
        inStock: true
      },
      {
        name: 'Layered Chain Necklace',
        slug: 'layered-chain-necklace',
        sku: 'NCK-004',
        description: 'Trendy layered chain necklace with multiple strands for modern style',
        price: 9999,
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        categorySlug: 'casual-necklace',
        featured: false,
        inStock: true
      },
      {
        name: 'Bar Necklace',
        slug: 'bar-necklace',
        sku: 'NCK-005',
        description: 'Minimalist bar necklace with sleek design for subtle elegance',
        price: 5499,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'
        ],
        categorySlug: 'casual-necklace',
        featured: true,
        inStock: true
      },

      // Jewelry Set (5 products)
      {
        name: 'Bridal Jewelry Set',
        slug: 'bridal-jewelry-set',
        sku: 'SET-001',
        description: 'Complete bridal jewelry set with necklace, earrings, maang tikka, and bangles',
        price: 45999,
        comparePrice: 59999,
        images: [
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        categorySlug: 'jewelry-set',
        featured: true,
        inStock: true
      },
      {
        name: 'Party Wear Jewelry Set',
        slug: 'party-wear-jewelry-set',
        sku: 'SET-002',
        description: 'Glamorous jewelry set with statement necklace and matching earrings for parties',
        price: 25999,
        comparePrice: 34999,
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        ],
        categorySlug: 'jewelry-set',
        featured: true,
        inStock: true
      },
      {
        name: 'Traditional Jewelry Set',
        slug: 'traditional-jewelry-set',
        sku: 'SET-003',
        description: 'Ethnic jewelry set with necklace, earrings, and bangles in antique gold',
        price: 35999,
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
        ],
        categorySlug: 'jewelry-set',
        featured: false,
        inStock: true
      },
      {
        name: 'Pearl Jewelry Set',
        slug: 'pearl-jewelry-set',
        sku: 'SET-004',
        description: 'Elegant pearl jewelry set with necklace and earrings in silver setting',
        price: 18999,
        comparePrice: 24999,
        images: [
          'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ],
        categorySlug: 'jewelry-set',
        featured: true,
        inStock: true
      },
      {
        name: 'Diamond Jewelry Set',
        slug: 'diamond-jewelry-set',
        sku: 'SET-005',
        description: 'Luxurious diamond jewelry set with necklace, earrings, and bracelet',
        price: 65999,
        comparePrice: 79999,
        images: [
          'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ],
        categorySlug: 'jewelry-set',
        featured: true,
        inStock: true
      }
    ]

    // Create products
    let productCount = 0
    for (const productData of allProducts) {
      const category = createdCategories.find(c => c.slug === productData.categorySlug)
      
      if (!category) {
        console.log(`   ⚠️  Category not found for ${productData.name}`)
        continue
      }

      const { categorySlug, ...product } = productData
      
      const createdProduct = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          ...product,
          categoryId: category.id
        },
        create: {
          ...product,
          categoryId: category.id
        }
      })
      
      productCount++
      console.log(`   ✅ ${createdProduct.name} (${createdProduct.sku})`)
    }

    console.log('\n📊 Summary:')
    console.log(`   ✅ ${createdCategories.length} categories created/updated`)
    console.log(`   ✅ ${productCount} products created/updated`)

    // Show final counts
    const finalCounts = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('\n📁 Final Category Status:')
    finalCounts.forEach(cat => {
      console.log(`   ${cat.order}. ${cat.name} - ${cat._count.products} products`)
    })

    console.log('\n✅ Seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedAllCategories()
