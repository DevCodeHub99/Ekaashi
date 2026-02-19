const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function fixImages() {
  const variants = await prisma.productVariant.findMany()
  
  for (const v of variants) {
    const newImages = v.images.map(img => {
      if (img.includes('placeholder')) {
        if (img.includes('Silver')) return 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        if (img.includes('Rose')) return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        if (img.includes('Black')) return 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
      }
      return img
    })
    
    await prisma.productVariant.update({
      where: { id: v.id },
      data: { images: newImages }
    })
    console.log(`✅ ${v.name}`)
  }
  
  console.log(`\nUpdated ${variants.length} variants`)
  await prisma.$disconnect()
}

fixImages()
