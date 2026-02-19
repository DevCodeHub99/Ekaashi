const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyProductDetails() {
  try {
    console.log('🔍 Verifying product details...\n')

    // Get a sample of products from different categories
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        category: true
      }
    })

    console.log(`Checking ${products.length} sample products:\n`)
    console.log('='.repeat(80))

    for (const product of products) {
      console.log(`\n📦 Product: ${product.name}`)
      console.log(`   SKU: ${product.sku}`)
      console.log(`   Category: ${product.category?.name || 'N/A'}`)
      console.log(`   Has Specifications: ${product.specifications ? '✅ Yes' : '❌ No'}`)
      console.log(`   Has Care Instructions: ${product.careInstructions ? '✅ Yes' : '❌ No'}`)
      
      if (product.specifications) {
        const specLines = product.specifications.split('\n').length
        console.log(`   Specifications Length: ${specLines} lines`)
      }
      
      if (product.careInstructions) {
        const careLines = product.careInstructions.split('\n').length
        console.log(`   Care Instructions Length: ${careLines} lines`)
      }
    }

    console.log('\n' + '='.repeat(80))

    // Get statistics
    const totalProducts = await prisma.product.count()
    const productsWithSpecs = await prisma.product.count({
      where: {
        specifications: {
          not: null
        }
      }
    })
    const productsWithCare = await prisma.product.count({
      where: {
        careInstructions: {
          not: null
        }
      }
    })

    console.log('\n📊 Overall Statistics:')
    console.log('='.repeat(80))
    console.log(`Total Products: ${totalProducts}`)
    console.log(`Products with Specifications: ${productsWithSpecs} (${Math.round(productsWithSpecs/totalProducts*100)}%)`)
    console.log(`Products with Care Instructions: ${productsWithCare} (${Math.round(productsWithCare/totalProducts*100)}%)`)
    console.log('='.repeat(80))

    // Show one complete example
    const exampleProduct = await prisma.product.findFirst({
      where: {
        AND: [
          { specifications: { not: null } },
          { careInstructions: { not: null } }
        ]
      }
    })

    if (exampleProduct) {
      console.log('\n📄 Example Product Details:')
      console.log('='.repeat(80))
      console.log(`Product: ${exampleProduct.name}`)
      console.log('\nSpecifications:')
      console.log(exampleProduct.specifications)
      console.log('\nCare Instructions:')
      console.log(exampleProduct.careInstructions?.substring(0, 200) + '...')
      console.log('='.repeat(80))
    }

    console.log('\n✅ Verification complete!')

  } catch (error) {
    console.error('❌ Error verifying product details:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

verifyProductDetails()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
