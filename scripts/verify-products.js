const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Verifying products with SKUs...\n')
    
    const products = await prisma.product.findMany({
      select: {
        name: true,
        sku: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        sku: 'asc'
      },
      take: 10
    })
    
    console.log(`✅ Found ${products.length} products (showing first 10):\n`)
    console.log('SKU       | Product Name                          | Category              | Price')
    console.log('----------|---------------------------------------|----------------------|--------')
    
    products.forEach(product => {
      const sku = product.sku.padEnd(9)
      const name = product.name.substring(0, 37).padEnd(37)
      const category = product.category.name.substring(0, 20).padEnd(20)
      const price = `₹${product.price}`
      console.log(`${sku} | ${name} | ${category} | ${price}`)
    })
    
    const totalCount = await prisma.product.count()
    console.log(`\n📊 Total products in database: ${totalCount}`)
    
    const categoriesCount = await prisma.category.count()
    console.log(`📁 Total categories: ${categoriesCount}`)
    
    const bannersCount = await prisma.banner.count()
    console.log(`🎨 Total banners: ${bannersCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
