const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function cleanup() {
  try {
    console.log('🧹 Cleaning up extra categories...\n')

    // Find and delete the "Earring" category (test category)
    const extraCategory = await prisma.category.findUnique({
      where: { slug: 'earring' }
    })

    if (extraCategory) {
      await prisma.category.delete({
        where: { id: extraCategory.id }
      })
      console.log('✅ Deleted extra "Earring" category')
    } else {
      console.log('ℹ️  No extra categories found')
    }

    // Show final categories
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('\n📁 Final Categories:')
    categories.forEach(cat => {
      console.log(`   ${cat.order}. ${cat.name} (${cat.slug}) - ${cat._count.products} products`)
    })

    console.log('\n✅ Cleanup complete!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

cleanup()
