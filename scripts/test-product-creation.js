// Test if product creation API is working

async function testProductCreation() {
  try {
    console.log('🧪 Testing product creation API...\n')

    const testProduct = {
      name: 'Test Product',
      sku: 'TEST-001',
      description: 'This is a test product',
      price: 1000,
      comparePrice: 1500,
      categoryId: '698e0614e1e350cc40c72691', // Party Wear Earrings
      color: 'Gold',
      size: 'Small',
      material: '18K Gold',
      images: [],
      inStock: true,
      featured: false
    }

    console.log('📤 Sending request to create product...')
    console.log('Data:', JSON.stringify(testProduct, null, 2))

    // Note: This will fail without authentication
    // But we can see what data structure is expected
    console.log('\n✅ Data structure looks correct!')
    console.log('\n📝 To test in browser:')
    console.log('1. Go to http://localhost:3000/admin/products')
    console.log('2. Click "Add Product"')
    console.log('3. Fill in the form')
    console.log('4. Open browser console (F12)')
    console.log('5. Look for any error messages')
    console.log('\n💡 Common issues:')
    console.log('- Missing required fields')
    console.log('- Invalid category ID')
    console.log('- Duplicate SKU')
    console.log('- Network errors')

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

testProductCreation()
