const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: 'classic-silver-earring'
      },
      include: {
        variants: true
      }
    })

    if (!product) {
      console.log('❌ Product not found')
      return
    }

    console.log('\n' + '='.repeat(80))
    console.log('📦 PRODUCT DATA')
    console.log('='.repeat(80))
    console.log('Name:', product.name)
    console.log('Slug:', product.slug)
    console.log('Main Product Color:', product.color)
    console.log('Main Product Size:', product.size)
    console.log('Main Product Material:', product.material)
    console.log('In Stock:', product.inStock)
    
    console.log('\n' + '-'.repeat(80))
    console.log('🎨 VARIANTS')
    console.log('-'.repeat(80))
    
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant, index) => {
        console.log(`\nVariant ${index + 1}:`)
        console.log('  Name:', variant.name)
        console.log('  SKU:', variant.sku)
        console.log('  Attributes:', variant.attributes)
        console.log('  In Stock:', variant.inStock)
        console.log('  Stock:', variant.stock)
      })
    } else {
      console.log('No variants found')
    }

    console.log('\n' + '='.repeat(80))
    console.log('🔍 ANALYSIS')
    console.log('='.repeat(80))
    
    const colors = []
    if (product.color) {
      colors.push({ color: product.color, source: 'main' })
    }
    
    if (product.variants) {
      product.variants.forEach(v => {
        if (v.attributes && v.attributes.color) {
          colors.push({ color: v.attributes.color, source: 'variant' })
        }
      })
    }
    
    console.log('Available Colors:', colors)
    console.log('Total Colors:', colors.length)
    console.log('\nExpected Behavior:')
    if (colors.length === 0) {
      console.log('  ❌ NO COLORS - Button should always be enabled')
    } else if (colors.length === 1) {
      console.log('  ✅ ONE COLOR - Should auto-select, button enabled')
    } else {
      console.log('  ✅ MULTIPLE COLORS - Should auto-select main color, button enabled')
      console.log('  Main color should be:', product.color)
    }
    
    console.log('\n' + '='.repeat(80))

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProduct()
