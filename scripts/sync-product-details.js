const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Sample specifications templates by category
const specificationsTemplates = {
  rings: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 3.5g
Ring Size: Adjustable (US 6-8)
Stone Type: Cubic Zirconia
Stone Count: 1 center stone + 12 accent stones
Dimensions: 15mm x 12mm
Plating: 18K Gold
Hypoallergenic: Yes`,

  earrings: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 4.2g (pair)
Drop Length: 3.5cm
Width: 1.8cm
Stone Type: Cubic Zirconia
Stone Count: 24 stones per pair
Closure Type: Push back
Plating: 18K Gold
Hypoallergenic: Yes`,

  necklaces: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 12.5g
Chain Length: 45cm (adjustable to 50cm)
Pendant Size: 2.5cm x 2cm
Stone Type: Cubic Zirconia
Stone Count: 35 stones
Chain Type: Cable chain
Clasp: Lobster clasp
Plating: 18K Gold
Hypoallergenic: Yes`,

  bracelets: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: 8.5g
Length: 18cm (adjustable to 21cm)
Width: 1.2cm
Stone Type: Cubic Zirconia
Stone Count: 48 stones
Clasp Type: Box clasp with safety
Plating: 18K Gold
Hypoallergenic: Yes`,

  bangles: `Material: Brass
Finish: Gold Plated
Weight: 25g (per piece)
Inner Diameter: 6.5cm (2.56 inches)
Width: 1.5cm
Thickness: 3mm
Opening: Flexible
Plating: 22K Gold
Design: Traditional Indian pattern
Hypoallergenic: Yes`,

  default: `Material: Sterling Silver 925
Finish: Gold Plated
Weight: Varies by design
Stone Type: Cubic Zirconia
Plating: 18K Gold
Hypoallergenic: Yes
Handcrafted: Yes
Quality: Premium`
}

// Care instructions (same for all jewelry)
const careInstructions = `Daily Care:
• Clean with a soft, lint-free cloth after each wear
• Store in individual pouches to prevent scratching
• Keep away from moisture and humidity
• Remove before sleeping to maintain shape

What to Avoid:
• Contact with perfumes, lotions, hairspray, and chemicals
• Exposure to water while swimming, showering, or exercising
• Harsh cleaning agents or abrasive materials
• Direct sunlight and extreme temperatures

Storage Tips:
• Store in a cool, dry place
• Use anti-tarnish strips in storage boxes
• Keep pieces separated to prevent tangling
• Use original packaging when possible

Cleaning:
• Use mild soap and lukewarm water for gentle cleaning
• Pat dry with a soft cloth immediately
• For deep cleaning, visit a professional jeweler
• Avoid ultrasonic cleaners unless recommended

Professional Care:
• Get jewelry professionally cleaned every 6-12 months
• Check clasps and settings regularly
• Re-plating available for worn gold plating
• Lifetime warranty covers manufacturing defects`

async function syncProductDetails() {
  try {
    console.log('🔄 Starting product details sync...\n')

    // Fetch all products
    const products = await prisma.product.findMany({
      include: {
        category: true
      }
    })

    console.log(`📦 Found ${products.length} products to update\n`)

    let updatedCount = 0
    let skippedCount = 0

    for (const product of products) {
      // Skip if product already has both specifications and care instructions
      if (product.specifications && product.careInstructions) {
        console.log(`⏭️  Skipping "${product.name}" - already has complete details`)
        skippedCount++
        continue
      }

      // Determine category slug for template selection
      const categorySlug = product.category?.slug || 'default'
      
      // Get appropriate specifications template
      let specifications = specificationsTemplates[categorySlug] || specificationsTemplates.default
      
      // Customize specifications with product-specific data if available
      if (product.material) {
        specifications = specifications.replace(/Material: [^\n]+/, `Material: ${product.material}`)
      }
      if (product.color) {
        specifications += `\nColor: ${product.color}`
      }
      if (product.size) {
        specifications += `\nSize: ${product.size}`
      }

      // Update product
      await prisma.product.update({
        where: { id: product.id },
        data: {
          specifications: product.specifications || specifications,
          careInstructions: product.careInstructions || careInstructions
        }
      })

      console.log(`✅ Updated "${product.name}" (${product.sku})`)
      updatedCount++
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Sync Summary:')
    console.log('='.repeat(60))
    console.log(`✅ Updated: ${updatedCount} products`)
    console.log(`⏭️  Skipped: ${skippedCount} products (already complete)`)
    console.log(`📦 Total: ${products.length} products`)
    console.log('='.repeat(60))
    console.log('\n✨ Product details sync completed successfully!')

  } catch (error) {
    console.error('❌ Error syncing product details:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the sync
syncProductDetails()
  .then(() => {
    console.log('\n🎉 All done! Your products now have specifications and care instructions.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Sync failed:', error)
    process.exit(1)
  })
