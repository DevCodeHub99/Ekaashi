const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCategories() {
  try {
    console.log('🔍 Checking all categories in database...\n')

    const allCategories = await prisma.category.findMany({
      orderBy: { order: 'asc' }
    })

    console.log(`Total categories: ${allCategories.length}\n`)

    allCategories.forEach(cat => {
      console.log(`ID: ${cat.id}`)
      console.log(`Name: ${cat.name}`)
      console.log(`Slug: ${cat.slug}`)
      console.log(`ParentId: ${cat.parentId || 'null (top-level)'}`)
      console.log(`IsActive: ${cat.isActive}`)
      console.log(`Order: ${cat.order}`)
      console.log('---')
    })

    // Check what the API would return
    const apiCategories = await prisma.category.findMany({
      where: {
        isActive: true,
        parentId: null
      },
      orderBy: { order: 'asc' }
    })

    console.log(`\n✅ Categories that would be returned by API: ${apiCategories.length}`)
    apiCategories.forEach(cat => {
      console.log(`   - ${cat.name} (${cat.slug})`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
