const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...')

    const categories = [
      { 
        name: 'Party Wear Earrings', 
        slug: 'party-wear-earrings', 
        description: 'Glamorous earrings perfect for parties, weddings, and special occasions',
        isActive: true,
        order: 1
      },
      { 
        name: 'Ethnic Earrings', 
        slug: 'ethnic-earrings', 
        description: 'Traditional and cultural designs that celebrate heritage with modern appeal',
        isActive: true,
        order: 2
      },
      { 
        name: 'Casual Earrings', 
        slug: 'casual-earrings', 
        description: 'Everyday elegance with comfortable and stylish designs for daily wear',
        isActive: true,
        order: 3
      },
      { 
        name: 'Casual Necklace', 
        slug: 'casual-necklace', 
        description: 'Delicate and versatile necklaces perfect for everyday styling',
        isActive: true,
        order: 4
      },
      { 
        name: 'Jewelry Set', 
        slug: 'jewelry-set', 
        description: 'Complete coordinated collections of matching earrings and necklaces',
        isActive: true,
        order: 5
      }
    ]

    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {
          description: cat.description,
          isActive: cat.isActive,
          order: cat.order
        },
        create: cat
      })
      console.log(`✅ ${category.name} - ${category.slug}`)
    }

    const count = await prisma.category.count()
    console.log(`\n✅ Total categories in database: ${count}`)

    // Show all categories
    const allCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    })

    console.log('\n📁 All Categories:')
    allCategories.forEach(cat => {
      console.log(`   ${cat.order}. ${cat.name} (${cat.slug}) - ${cat._count.products} products - ${cat.isActive ? 'Active' : 'Inactive'}`)
    })

  } catch (error) {
    console.error('❌ Error seeding categories:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()
