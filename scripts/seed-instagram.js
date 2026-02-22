const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const samplePosts = [
  {
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1080&h=1080&fit=crop',
    caption: '✨ New arrival! Elegant gold earrings perfect for any occasion',
    link: 'https://instagram.com/p/example1',
    isActive: true,
    order: 0
  },
  {
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1080&h=1080&fit=crop',
    caption: '💎 Stunning diamond necklace from our premium collection',
    link: 'https://instagram.com/p/example2',
    isActive: true,
    order: 1
  },
  {
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1080&h=1080&fit=crop',
    caption: '🌟 Handcrafted silver bracelet with intricate details',
    link: 'https://instagram.com/p/example3',
    isActive: true,
    order: 2
  },
  {
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1080&h=1080&fit=crop',
    caption: '💍 Beautiful engagement rings that tell your love story',
    link: 'https://instagram.com/p/example4',
    isActive: true,
    order: 3
  },
  {
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1080&h=1080&fit=crop',
    caption: '✨ Rose gold collection - feminine and elegant',
    link: 'https://instagram.com/p/example5',
    isActive: true,
    order: 4
  },
  {
    image: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1080&h=1080&fit=crop',
    caption: '🎁 Perfect gift for someone special',
    link: 'https://instagram.com/p/example6',
    isActive: true,
    order: 5
  }
]

async function seedInstagram() {
  try {
    console.log('🌱 Seeding Instagram posts...\n')
    
    // Delete existing posts
    const deleted = await prisma.instagramPost.deleteMany({})
    console.log(`🗑️  Deleted ${deleted.count} existing posts\n`)
    
    // Create new posts
    let created = 0
    for (const post of samplePosts) {
      const newPost = await prisma.instagramPost.create({
        data: post
      })
      created++
      console.log(`✅ Created post ${created}: ${post.caption.substring(0, 50)}...`)
    }
    
    console.log(`\n✨ Successfully seeded ${created} Instagram posts!`)
    console.log('\n📍 View them at:')
    console.log('   Admin: http://localhost:3000/admin/instagram')
    console.log('   Homepage: http://localhost:3000 (scroll to bottom)')
    
  } catch (error) {
    console.error('❌ Error seeding Instagram posts:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

seedInstagram()
