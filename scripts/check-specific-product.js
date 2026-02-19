const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkProduct() {
  try {
    const product = await prisma.product.findUnique({
      where: { sku: 'S1' },
      include: {
        category: true,
        variants: true
      }
    })

    if (product) {
      console.log('✅ Product found in database:')
      console.log(JSON.stringify(product, null, 2))
    } else {
      console.log('❌ Product not found')
    }

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkProduct()
