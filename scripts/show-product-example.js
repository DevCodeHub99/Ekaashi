const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function showProductExample() {
  try {
    // Get a product with all details
    const product = await prisma.product.findFirst({
      where: {
        slug: 'golden-elegance-drop-earrings'
      },
      include: {
        category: true
      }
    })

    if (!product) {
      console.log('❌ Product not found')
      return
    }

    console.log('\n' + '='.repeat(80))
    console.log('📦 PRODUCT DETAILS EXAMPLE')
    console.log('='.repeat(80))
    console.log(`\nProduct Name: ${product.name}`)
    console.log(`SKU: ${product.sku}`)
    console.log(`Category: ${product.category?.name}`)
    console.log(`Price: ₹${product.price}`)
    console.log(`URL: http://localhost:3000/product/${product.slug}`)
    
    console.log('\n' + '-'.repeat(80))
    console.log('📋 SPECIFICATIONS:')
    console.log('-'.repeat(80))
    console.log(product.specifications || 'No specifications')
    
    console.log('\n' + '-'.repeat(80))
    console.log('💎 CARE INSTRUCTIONS:')
    console.log('-'.repeat(80))
    console.log(product.careInstructions || 'No care instructions')
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ This data is now visible on the product page!')
    console.log('🌐 Visit: http://localhost:3000/product/' + product.slug)
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

showProductExample()
