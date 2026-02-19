const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: {
      sku: true,
      name: true,
      category: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      sku: 'asc'
    }
  })
  
  const grouped = {}
  products.forEach(p => {
    const cat = p.category.name
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(`${p.sku}: ${p.name}`)
  })
  
  console.log('✅ All Products with SKUs:\n')
  Object.keys(grouped).sort().forEach(cat => {
    console.log(`📁 ${cat}:`)
    grouped[cat].forEach(item => console.log(`   ${item}`))
    console.log()
  })
  
  await prisma.$disconnect()
}

main()
