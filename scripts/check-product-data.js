const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProductData() {
  try {
    console.log('\n' + '='.repeat(80))
    console.log('📋 CHECKING PRODUCT DATA')
    console.log('='.repeat(80))

    // Get one product to show all fields
    const product = await prisma.product.findFirst({
      where: {
        slug: 'golden-elegance-drop-earrings'
      }
    })

    if (!product) {
      console.log('❌ Product not found')
      return
    }

    console.log(`\n📦 Product: ${product.name}`)
    console.log(`🔗 URL: http://localhost:3000/product/${product.slug}`)
    
    console.log('\n' + '-'.repeat(80))
    console.log('📝 DESCRIPTION:')
    console.log('-'.repeat(80))
    console.log(product.description || '(empty)')
    console.log(`Length: ${product.description?.length || 0} characters`)
    
    console.log('\n' + '-'.repeat(80))
    console.log('📋 SPECIFICATIONS:')
    console.log('-'.repeat(80))
    console.log(product.specifications || '(empty)')
    console.log(`Length: ${product.specifications?.length || 0} characters`)
    
    console.log('\n' + '-'.repeat(80))
    console.log('💎 CARE INSTRUCTIONS:')
    console.log('-'.repeat(80))
    console.log(product.careInstructions || '(empty)')
    console.log(`Length: ${product.careInstructions?.length || 0} characters`)
    
    console.log('\n' + '='.repeat(80))
    console.log('✅ All three fields are now available on the product page!')
    console.log('🌐 Visit the URL above and check each tab')
    console.log('='.repeat(80) + '\n')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProductData()
