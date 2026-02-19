const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProduct() {
  try {
    const product = await prisma.product.findFirst({
      where: { slug: 'elegant-drop-earrings' },
      include: { variants: true }
    })

    console.log('Product:', product.name)
    console.log('Main Color:', product.color)
    console.log('Price:', product.price)
    console.log('\nVariants:')
    product.variants.forEach(v => {
      console.log(`  - ${v.name} (${v.attributes.color}): ₹${v.price}`)
    })
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProduct()
