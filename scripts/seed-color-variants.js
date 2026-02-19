const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedColorVariants() {
  try {
    console.log('🎨 Starting to seed products with color variations...\n')

    // Get categories
    const categories = await prisma.category.findMany()
    const earringsCategory = categories.find(c => c.slug === 'party-wear-earrings')
    const necklacesCategory = categories.find(c => c.slug === 'casual-necklace')
    const ringsCategory = categories.find(c => c.slug === 'jewelry-set')

    if (!earringsCategory || !necklacesCategory || !ringsCategory) {
      console.log('❌ Required categories not found')
      console.log('Available categories:', categories.map(c => c.slug))
      return
    }

    const products = [
      // Product 1: Elegant Drop Earrings with 3 colors
      {
        name: 'Elegant Drop Earrings',
        slug: 'elegant-drop-earrings',
        sku: 'EDE-001',
        description: 'Beautiful drop earrings perfect for parties and special occasions',
        specifications: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 4.5g (pair)
Drop Length: 4cm
Stone Type: Cubic Zirconia
Hypoallergenic: Yes`,
        careInstructions: `• Clean with soft cloth after each wear
• Store in individual pouches
• Avoid contact with water and perfumes
• Keep away from direct sunlight`,
        price: 1299,
        comparePrice: 1999,
        images: ['https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Earrings'],
        color: 'Gold',
        size: 'Medium',
        material: 'Sterling Silver',
        inStock: true,
        featured: true,
        categoryId: earringsCategory.id,
        variants: [
          {
            sku: 'EDE-001-SILVER',
            name: 'Silver',
            attributes: { color: 'Silver', size: 'Medium' },
            price: 1199,
            comparePrice: 1899,
            images: ['https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Earrings'],
            inStock: true,
            stock: 15
          },
          {
            sku: 'EDE-001-ROSEGOLD',
            name: 'Rose Gold',
            attributes: { color: 'Rose Gold', size: 'Medium' },
            price: 1399,
            comparePrice: 2099,
            images: ['https://via.placeholder.com/800x800/B76E79/000000?text=Rose+Gold+Earrings'],
            inStock: true,
            stock: 10
          }
        ]
      },

      // Product 2: Statement Necklace with 2 colors
      {
        name: 'Statement Necklace Set',
        slug: 'statement-necklace-set',
        sku: 'SNS-001',
        description: 'Stunning statement necklace set with matching earrings',
        specifications: `Material: Brass
Finish: Gold Plated
Weight: 85g
Chain Length: 45cm
Stone Type: Kundan
Design: Traditional Indian`,
        careInstructions: `• Store in anti-tarnish pouches
• Clean with dry soft cloth
• Avoid water and chemicals
• Keep away from perfumes`,
        price: 2499,
        comparePrice: 3999,
        images: ['https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Necklace'],
        color: 'Gold',
        size: 'One Size',
        material: 'Brass',
        inStock: true,
        featured: true,
        categoryId: necklacesCategory.id,
        variants: [
          {
            sku: 'SNS-001-SILVER',
            name: 'Silver',
            attributes: { color: 'Silver', size: 'One Size' },
            price: 2299,
            comparePrice: 3799,
            images: ['https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Necklace'],
            inStock: true,
            stock: 8
          }
        ]
      },

      // Product 3: Adjustable Ring with 4 colors
      {
        name: 'Designer Adjustable Ring',
        slug: 'designer-adjustable-ring',
        sku: 'DAR-001',
        description: 'Elegant adjustable ring with intricate design',
        specifications: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 3.2g
Ring Size: Adjustable (US 6-9)
Stone Type: Cubic Zirconia
Stone Count: 5 stones`,
        careInstructions: `• Remove before washing hands
• Clean with jewelry cleaner
• Store separately to avoid scratches
• Avoid harsh chemicals`,
        price: 899,
        comparePrice: 1499,
        images: ['https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Ring'],
        color: 'Gold',
        size: 'Adjustable',
        material: 'Sterling Silver',
        inStock: true,
        featured: false,
        categoryId: ringsCategory.id,
        variants: [
          {
            sku: 'DAR-001-SILVER',
            name: 'Silver',
            attributes: { color: 'Silver', size: 'Adjustable' },
            price: 799,
            comparePrice: 1399,
            images: ['https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Ring'],
            inStock: true,
            stock: 20
          },
          {
            sku: 'DAR-001-ROSEGOLD',
            name: 'Rose Gold',
            attributes: { color: 'Rose Gold', size: 'Adjustable' },
            price: 949,
            comparePrice: 1599,
            images: ['https://via.placeholder.com/800x800/B76E79/000000?text=Rose+Gold+Ring'],
            inStock: true,
            stock: 12
          },
          {
            sku: 'DAR-001-BLACK',
            name: 'Black',
            attributes: { color: 'Black', size: 'Adjustable' },
            price: 999,
            comparePrice: 1699,
            images: ['https://via.placeholder.com/800x800/000000/FFFFFF?text=Black+Ring'],
            inStock: true,
            stock: 8
          }
        ]
      },

      // Product 4: Hoop Earrings with 2 colors
      {
        name: 'Classic Hoop Earrings',
        slug: 'classic-hoop-earrings',
        sku: 'CHE-001',
        description: 'Timeless hoop earrings for everyday wear',
        specifications: `Material: Sterling Silver 925
Finish: Polished
Weight: 3.8g (pair)
Diameter: 3cm
Thickness: 2mm
Closure: Hinged`,
        careInstructions: `• Wipe clean after each use
• Store in jewelry box
• Avoid contact with cosmetics
• Polish regularly`,
        price: 699,
        comparePrice: 1199,
        images: ['https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Hoops'],
        color: 'Silver',
        size: 'Medium',
        material: 'Sterling Silver',
        inStock: true,
        featured: false,
        categoryId: earringsCategory.id,
        variants: [
          {
            sku: 'CHE-001-GOLD',
            name: 'Gold',
            attributes: { color: 'Gold', size: 'Medium' },
            price: 799,
            comparePrice: 1299,
            images: ['https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Hoops'],
            inStock: true,
            stock: 18
          }
        ]
      },

      // Product 5: Pendant Necklace with 3 colors
      {
        name: 'Heart Pendant Necklace',
        slug: 'heart-pendant-necklace-color',
        sku: 'HPN-002',
        description: 'Delicate heart pendant necklace with chain',
        specifications: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 5.5g
Chain Length: 40cm + 5cm extender
Pendant Size: 1.5cm x 1.5cm
Stone Type: Cubic Zirconia`,
        careInstructions: `• Remove before showering
• Clean with mild soap solution
• Dry thoroughly before storing
• Keep away from chemicals`,
        price: 1099,
        comparePrice: 1799,
        images: ['https://via.placeholder.com/800x800/FFD700/000000?text=Gold+Heart'],
        color: 'Gold',
        size: 'One Size',
        material: 'Sterling Silver',
        inStock: true,
        featured: true,
        categoryId: necklacesCategory.id,
        variants: [
          {
            sku: 'HPN-002-SILVER',
            name: 'Silver',
            attributes: { color: 'Silver', size: 'One Size' },
            price: 999,
            comparePrice: 1699,
            images: ['https://via.placeholder.com/800x800/C0C0C0/000000?text=Silver+Heart'],
            inStock: true,
            stock: 14
          },
          {
            sku: 'HPN-002-ROSEGOLD',
            name: 'Rose Gold',
            attributes: { color: 'Rose Gold', size: 'One Size' },
            price: 1199,
            comparePrice: 1899,
            images: ['https://via.placeholder.com/800x800/B76E79/000000?text=Rose+Gold+Heart'],
            inStock: true,
            stock: 10
          }
        ]
      }
    ]

    let createdCount = 0
    let variantCount = 0

    for (const productData of products) {
      const { variants, ...mainProduct } = productData

      // Create main product
      const product = await prisma.product.create({
        data: mainProduct
      })

      console.log(`✅ Created: ${product.name} (${product.color})`)
      createdCount++

      // Create variants
      if (variants && variants.length > 0) {
        for (const variantData of variants) {
          await prisma.productVariant.create({
            data: {
              ...variantData,
              productId: product.id
            }
          })
          console.log(`   ↳ Variant: ${variantData.name}`)
          variantCount++
        }
      }
      console.log('')
    }

    console.log('='.repeat(60))
    console.log('📊 Summary:')
    console.log('='.repeat(60))
    console.log(`✅ Products created: ${createdCount}`)
    console.log(`🎨 Variants created: ${variantCount}`)
    console.log(`📦 Total items: ${createdCount + variantCount}`)
    console.log('='.repeat(60))
    console.log('\n✨ All products with color variations have been seeded!')
    console.log('🌐 Visit: http://localhost:3000 to see them\n')

  } catch (error) {
    console.error('❌ Error seeding products:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seedColorVariants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
