const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🗑️  Deleting all existing data...')
    
    // Delete in correct order to respect foreign key constraints
    await prisma.orderItem.deleteMany()
    console.log('✓ Deleted order items')
    
    await prisma.order.deleteMany()
    console.log('✓ Deleted orders')
    
    await prisma.cartItem.deleteMany()
    console.log('✓ Deleted cart items')
    
    await prisma.abandonedCart.deleteMany()
    console.log('✓ Deleted abandoned carts')
    
    await prisma.productVariant.deleteMany()
    console.log('✓ Deleted product variants')
    
    await prisma.product.deleteMany()
    console.log('✓ Deleted products')
    
    await prisma.banner.deleteMany()
    console.log('✓ Deleted banners')
    
    await prisma.category.deleteMany()
    console.log('✓ Deleted categories')
    
    console.log('\n✅ All data deleted successfully!')
    console.log('\n🌱 Now call the seed API endpoint to reseed the database')
    console.log('   Visit: http://localhost:3000/api/seed-mongodb')
    
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
