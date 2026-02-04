const { PrismaClient } = require('@prisma/client')

async function initDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Connecting to database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Check if tables exist by trying to count users
    try {
      const userCount = await prisma.user.count()
      console.log(`✅ Database tables exist. Found ${userCount} users.`)
    } catch (error) {
      console.log('❌ Database tables do not exist. Need to run migrations.')
      console.log('Run: npx prisma db push')
      process.exit(1)
    }
    
    // Check if we have any products
    const productCount = await prisma.product.count()
    console.log(`📦 Found ${productCount} products in database`)
    
    if (productCount === 0) {
      console.log('⚠️  No products found. You may need to seed the database.')
    }
    
    console.log('🎉 Database initialization check complete!')
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

initDatabase()