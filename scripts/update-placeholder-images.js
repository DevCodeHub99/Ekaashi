const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateImages() {
  try {
    console.log('🖼️  Updating placeholder images to Unsplash...\n')

    // Map of products to update with real Unsplash images
    const updates = [
      {
        slug: 'elegant-drop-earrings',
        images: [
          'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ]
      },
      {
        slug: 'statement-necklace-set',
        images: [
          'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
          'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=800&q=80'
        ]
      },
      {
        slug: 'designer-adjustable-ring',
        images: [
          'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
          'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
        ]
      },
      {
        slug: 'classic-hoop-earrings',
        images: [
          'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=800&q=80',
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        ]
      },
      {
        slug: 'heart-pendant-necklace-color',
        images: [
          'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80',
          'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
        ]
      }
    ]

    let updated = 0

    for (const update of updates) {
      const product = await prisma.product.update({
        where: { slug: update.slug },
        data: { images: update.images }
      })
      console.log(`✅ Updated: ${product.name}`)
      updated++
    }

    // Also update variants
    const variants = await prisma.productVariant.findMany({
      where: {
        images: {
          hasSome: ['https://via.placeholder.com']
        }
      }
    })

    console.log(`\n🎨 Updating ${variants.length} variants...\n`)

    for (const variant of variants) {
      // Replace placeholder images with Unsplash
      const newImages = variant.images.map(img => {
        if (img.includes('Silver')) {
          return 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80'
        } else if (img.includes('Rose+Gold')) {
          return 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800&q=80'
        } else if (img.includes('Black')) {
          return 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'
        } else if (img.includes('Gold')) {
          return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
        }
        return img
      })

      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { images: newImages }
      })
      console.log(`✅ Updated variant: ${variant.name}`)
    }

    console.log('\n' + '='.repeat(60))
    console.log(`✅ Updated ${updated} products`)
    console.log(`✅ Updated ${variants.length} variants`)
    console.log('='.repeat(60))
    console.log('\n✨ All images updated to Unsplash!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateImages()
