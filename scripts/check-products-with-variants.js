const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProductsWithVariants() {
  try {
    console.log('🔍 Checking products with variants...\n')

    // Get all products with their variants
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    })

    console.log(`📊 Total products: ${products.length}\n`)

    for (const product of products) {
      console.log(`\n📦 Product: ${product.name}`)
      console.log(`   SKU: ${product.sku}`)
      console.log(`   Price: ₹${product.price}`)
      console.log(`   In Stock: ${product.inStock ? '✅ Yes' : '❌ No'}`)
      console.log(`   Featured: ${product.featured ? '⭐ Yes' : 'No'}`)
      console.log(`   Category: ${product.category.name}`)
      console.log(`   Slug: ${product.slug}`)
      console.log(`   Variants: ${product.variants.length}`)
      
      if (product.variants.length > 0) {
        console.log(`   \n   Variant Details:`)
        product.variants.forEach((v, i) => {
          console.log(`   ${i + 1}. ${v.name} (${v.sku})`)
          console.log(`      Price: ₹${v.price}, Stock: ${v.stock}, In Stock: ${v.inStock}`)
        })
      }
      console.log(`   ---`)
    }

    // Check if any products are not showing
    const productsWithVariants = products.filter(p => p.variants.length > 0)
    console.log(`\n\n📊 Summary:`)
    console.log(`   Total products: ${products.length}`)
    console.log(`   Products with variants: ${productsWithVariants.length}`)
    console.log(`   Products without variants: ${products.length - productsWithVariants.length}`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProductsWithVariants()
