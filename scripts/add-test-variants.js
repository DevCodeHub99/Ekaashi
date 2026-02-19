const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function addTestVariants() {
  try {
    console.log('🔍 Finding a product to add variants...\n')

    // Get the first product
    const product = await prisma.product.findFirst({
      where: {
        inStock: true
      }
    })

    if (!product) {
      console.log('❌ No products found')
      return
    }

    console.log(`✅ Found product: ${product.name} (SKU: ${product.sku})`)
    console.log(`   Adding 3 variants...\n`)

    // Create 3 variants
    const variants = [
      {
        productId: product.id,
        sku: `${product.sku}-GOLD-S`,
        name: 'Gold - Small',
        attributes: {
          color: 'Gold',
          size: 'Small',
          material: '18K Gold Plated'
        },
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        inStock: true,
        stock: 10
      },
      {
        productId: product.id,
        sku: `${product.sku}-GOLD-M`,
        name: 'Gold - Medium',
        attributes: {
          color: 'Gold',
          size: 'Medium',
          material: '18K Gold Plated'
        },
        price: product.price + 500,
        comparePrice: product.comparePrice ? product.comparePrice + 500 : null,
        images: product.images,
        inStock: true,
        stock: 8
      },
      {
        productId: product.id,
        sku: `${product.sku}-SILVER-S`,
        name: 'Silver - Small',
        attributes: {
          color: 'Silver',
          size: 'Small',
          material: 'Sterling Silver'
        },
        price: product.price - 500,
        comparePrice: product.comparePrice ? product.comparePrice - 500 : null,
        images: product.images,
        inStock: true,
        stock: 15
      }
    ]

    for (const variant of variants) {
      const created = await prisma.productVariant.create({
        data: variant
      })
      console.log(`   ✅ Created: ${created.name} (${created.sku}) - ₹${created.price}`)
    }

    console.log(`\n🎉 Successfully added 3 variants to "${product.name}"`)
    console.log(`\n📝 Test the buyer panel at:`)
    console.log(`   http://localhost:3000/product/${product.slug}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addTestVariants()
