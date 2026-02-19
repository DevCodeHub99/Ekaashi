const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkImages() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true
      }
    })

    console.log(`\n📸 Checking images for ${products.length} products...\n`)

    let withImages = 0
    let withoutImages = 0

    products.forEach(product => {
      if (product.images && product.images.length > 0) {
        console.log(`✅ ${product.name}`)
        console.log(`   Images: ${product.images.length}`)
        console.log(`   First image: ${product.images[0]}`)
        withImages++
      } else {
        console.log(`❌ ${product.name} - NO IMAGES`)
        withoutImages++
      }
      console.log('')
    })

    console.log('='.repeat(60))
    console.log(`✅ Products with images: ${withImages}`)
    console.log(`❌ Products without images: ${withoutImages}`)
    console.log('='.repeat(60))

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkImages()
