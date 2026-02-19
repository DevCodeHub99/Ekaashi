const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const count = await prisma.cartItem.count()
  console.log('Cart items in database:', count)
  
  await prisma.$disconnect()
}

main()
