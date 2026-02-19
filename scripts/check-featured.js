const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const featured = await prisma.product.findMany({
    where: { featured: true },
    select: { name: true, sku: true, featured: true }
  })
  
  console.log(`✅ Featured products: ${featured.length}`)
  featured.forEach(p => console.log(`   ${p.sku}: ${p.name}`))
  
  const total = await prisma.product.count()
  console.log(`\n📊 Total products: ${total}`)
  
  await prisma.$disconnect()
}

main()
