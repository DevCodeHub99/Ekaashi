const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateProductWithColor() {
  try {
    console.log('🎨 Updating product with color...\n')

    // Update the product with SKU S1
    const product = await prisma.product.update({
      where: { sku: 'S1' },
      data: {
        color: 'Gold',
        size: 'Small',
        material: '18K Gold Plated'
      }
    })

    console.log('✅ Product updated:')
    console.log(`   Name: ${product.name}`)
    console.log(`   SKU: ${product.sku}`)
    console.log(`   Color: ${product.color}`)
    console.log(`   Size: ${product.size}`)
    console.log(`   Material: ${product.material}`)
    console.log(`\n📝 Now the product has:`)
    console.log(`   - Main product color: Gold`)
    console.log(`   - Variant color: Gold (from variant)`)
    console.log(`\n🌐 Visit: http://localhost:3000/product/claasic-design-earring`)
    console.log(`   You should see color selector with Gold option!`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateProductWithColor()
