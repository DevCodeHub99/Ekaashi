'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Eye, X, Save, AlertCircle, CheckCircle, Package } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
import { formatPrice } from '@/lib/utils'
import ProductImage from '@/components/ui/product-image'
import ProductVariants from '@/components/admin/ProductVariants'

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  slug: string
  sku?: string
  description: string
  price: number
  comparePrice?: number
  images: string[]
  category: string
  inStock: boolean
  featured: boolean
}

interface ProductFormData {
  name: string
  sku: string
  description: string
  specifications: string
  careInstructions: string
  price: string
  comparePrice: string
  categoryId: string
  color: string
  size: string
  material: string
  inStock: boolean
  featured: boolean
  images: string[]
}

interface VariantFormData {
  id?: string
  sku: string
  name: string
  color: string
  size: string
  material: string
  price: string
  comparePrice: string
  images: string[]
  inStock: boolean
  stock: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    specifications: '',
    careInstructions: '',
    price: '',
    comparePrice: '',
    categoryId: '',
    color: '',
    size: '',
    material: '',
    inStock: true,
    featured: false,
    images: []
  })
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [showVariantsModal, setShowVariantsModal] = useState(false)
  const [variantsProduct, setVariantsProduct] = useState<Product | null>(null)
  const [addVariants, setAddVariants] = useState(false)
  const [variants, setVariants] = useState<VariantFormData[]>([])
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null)

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const result = await response.json()
      const data = result.success ? result.data : []
      setCategories(data)
      
      // Set default category if none selected
      if (data.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: data[0].id }))
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (categoryFilter !== 'all') params.append('category', categoryFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const response = await fetch(`/api/admin/products?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
      } else {
        showNotification('error', 'Failed to fetch products')
      }
    } catch (error) {
      showNotification('error', 'Error fetching products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [searchTerm, categoryFilter, statusFilter])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      description: '',
      specifications: '',
      careInstructions: '',
      price: '',
      comparePrice: '',
      categoryId: categories.length > 0 ? categories[0].id : '',
      color: '',
      size: '',
      material: '',
      inStock: true,
      featured: false,
      images: []
    })
    setAddVariants(false)
    setVariants([])
    setEditingVariantIndex(null)
  }

  const openModal = (mode: 'create' | 'edit' | 'view', product?: Product) => {
    setModalMode(mode)
    setSelectedProduct(product || null)
    
    if (mode === 'create') {
      resetForm()
    } else if (product) {
      // Find the category ID from the category slug
      const category = categories.find(cat => cat.slug === product.category)
      setFormData({
        name: product.name,
        sku: product.sku || '',
        description: product.description,
        specifications: (product as any).specifications || '',
        careInstructions: (product as any).careInstructions || '',
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        categoryId: category?.id || (categories.length > 0 ? categories[0].id : ''),
        color: (product as any).color || '',
        size: (product as any).size || '',
        material: (product as any).material || '',
        inStock: product.inStock,
        featured: product.featured,
        images: product.images || []
      })
      
      // Fetch existing variants if editing
      if (mode === 'edit') {
        fetchProductVariants(product.id)
      }
    }
    
    setShowModal(true)
  }

  const fetchProductVariants = async (productId: string) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/variants`)
      const result = await response.json()
      
      if (result.success && result.data.length > 0) {
        setAddVariants(true)
        const fetchedVariants = result.data.map((v: any) => ({
          id: v.id,
          sku: v.sku,
          name: v.name,
          color: v.attributes?.color || '',
          size: v.attributes?.size || '',
          material: v.attributes?.material || '',
          price: v.price.toString(),
          comparePrice: v.comparePrice?.toString() || '',
          images: v.images || [],
          inStock: v.inStock,
          stock: v.stock
        }))
        setVariants(fetchedVariants)
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = modalMode === 'create' 
        ? '/api/admin/products'
        : `/api/admin/products/${selectedProduct?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      console.log('Submitting product:', {
        url,
        method,
        data: {
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined
        }
      })
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined
        }),
      })

      const data = await response.json()
      console.log('Response:', data)
      
      if (data.success) {
        const productId = modalMode === 'create' ? data.data.id : selectedProduct?.id
        
        // Handle variants for both create and edit modes
        if (addVariants && variants.length > 0 && productId) {
          let successCount = 0
          let failCount = 0
          
          for (const variant of variants) {
            try {
              const attributes: any = {}
              if (variant.color) attributes.color = variant.color
              if (variant.size) attributes.size = variant.size
              if (variant.material) attributes.material = variant.material

              const variantData = {
                sku: variant.sku.toUpperCase(),
                name: variant.name,
                attributes,
                price: parseFloat(variant.price),
                comparePrice: variant.comparePrice ? parseFloat(variant.comparePrice) : undefined,
                images: variant.images,
                inStock: variant.inStock,
                stock: variant.stock
              }

              if (variant.id) {
                // Update existing variant
                const variantResponse = await fetch(`/api/admin/products/${productId}/variants/${variant.id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(variantData),
                })
                const variantResult = await variantResponse.json()
                if (variantResult.success) {
                  successCount++
                } else {
                  failCount++
                  console.error('Variant update failed:', variantResult.error)
                }
              } else {
                // Create new variant
                const variantResponse = await fetch(`/api/admin/products/${productId}/variants`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(variantData),
                })
                const variantResult = await variantResponse.json()
                if (variantResult.success) {
                  successCount++
                } else {
                  failCount++
                  console.error('Variant creation failed:', variantResult.error)
                }
              }
            } catch (variantError) {
              failCount++
              console.error('Error processing variant:', variantError)
            }
          }
          
          if (failCount > 0) {
            showNotification('success', `${data.message}. ${successCount} variant(s) created, ${failCount} failed`)
          } else {
            showNotification('success', `${data.message} with ${successCount} variant(s)`)
          }
        } else {
          showNotification('success', data.message)
        }
        
        closeModal()
        // Force refresh the products list
        await fetchProducts()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      showNotification('error', 'An error occurred while saving')
    }
  }

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', data.message)
        fetchProducts()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      showNotification('error', 'Failed to delete product')
    }
  }

  const handleImageClick = (imageSrc: string, productName: string) => {
    setSelectedImage({ src: imageSrc, alt: productName })
    setShowImageModal(true)
  }

  const addVariantToList = () => {
    const newVariant: VariantFormData = {
      sku: '',
      name: '',
      color: '',
      size: '',
      material: '',
      price: formData.price || '0',
      comparePrice: '',
      images: [],
      inStock: true,
      stock: 0
    }
    setVariants([...variants, newVariant])
    setEditingVariantIndex(variants.length)
  }

  const updateVariant = (index: number, field: keyof VariantFormData, value: any) => {
    const updatedVariants = [...variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    setVariants(updatedVariants)
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
    if (editingVariantIndex === index) {
      setEditingVariantIndex(null)
    }
  }

  const getColorBadge = (color?: string) => {
    if (!color) return null
    
    const colorMap: { [key: string]: string } = {
      gold: 'bg-yellow-400',
      silver: 'bg-gray-300',
      'rose gold': 'bg-pink-300',
      platinum: 'bg-gray-400',
      white: 'bg-white border border-gray-300',
      black: 'bg-black',
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
    }

    const bgColor = colorMap[color.toLowerCase()] || 'bg-gray-200'

    return (
      <span className="inline-flex items-center space-x-1">
        <span className={`w-3 h-3 rounded-full ${bgColor}`}></span>
        <span className="capitalize text-xs">{color}</span>
      </span>
    )
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'in-stock' && product.inStock) ||
                         (statusFilter === 'out-of-stock' && !product.inStock)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your jewelry collection</p>
        </div>
        <Button 
          onClick={() => openModal('create')}
          className="bg-amber-600 hover:bg-amber-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-600 mb-6">
                {products.length === 0 
                  ? "Start by adding your first jewelry product."
                  : "Try adjusting your search or filters."
                }
              </p>
              <Button 
                onClick={() => openModal('create')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Featured</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-12 h-12 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg overflow-hidden flex items-center justify-center hover:shadow-md transition-shadow duration-200 cursor-pointer group"
                            onClick={() => product.images?.[0] && handleImageClick(product.images[0], product.name)}
                          >
                            <ProductImage
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{product.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-mono text-sm text-gray-700">{product.sku || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          {categories.find(cat => cat.slug === product.category)?.name || product.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{formatPrice(product.price)}</div>
                        {product.comparePrice && (
                          <div className="text-sm text-gray-500 line-through">
                            {formatPrice(product.comparePrice)}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {product.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setVariantsProduct(product)
                              setShowVariantsModal(true)
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Manage Variants"
                          >
                            <Package className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('view', product)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openModal('edit', product)}
                            className="text-amber-600 hover:text-amber-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' && 'Add New Product'}
                {modalMode === 'edit' && 'Edit Product'}
                {modalMode === 'view' && 'Product Details'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100 uppercase"
                    placeholder="e.g., RING-001"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique product identifier</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    disabled={modalMode === 'view'}
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                  >
                    {categories.length === 0 ? (
                      <option value="">Loading categories...</option>
                    ) : (
                      <>
                        {!formData.categoryId && <option value="">Select a category</option>}
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    disabled={modalMode === 'view'}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={modalMode === 'view'}
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="e.g., Gold, Silver"
                  />
                  <p className="text-xs text-gray-500 mt-1">Main product color</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="e.g., Small, Medium"
                  />
                  <p className="text-xs text-gray-500 mt-1">Main product size</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    disabled={modalMode === 'view'}
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="e.g., 18K Gold"
                  />
                  <p className="text-xs text-gray-500 mt-1">Main product material</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  disabled={modalMode === 'view'}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter product description"
                />
                <p className="text-xs text-gray-500 mt-1">Main product description shown on product page</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <textarea
                  rows={6}
                  disabled={modalMode === 'view'}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter product specifications (e.g., Material: Sterling Silver, Weight: 12.5g, Dimensions: 2.5cm x 1.8cm)"
                />
                <p className="text-xs text-gray-500 mt-1">Technical specifications shown in Specifications tab</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Instructions
                </label>
                <textarea
                  rows={6}
                  disabled={modalMode === 'view'}
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="Enter care instructions (e.g., Store in a dry place, Clean with soft cloth, Avoid contact with perfumes)"
                />
                <p className="text-xs text-gray-500 mt-1">Care instructions shown in Care Instructions tab</p>
              </div>

              <div>
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  disabled={modalMode === 'view'}
                  maxImages={5}
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={modalMode === 'view'}
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={modalMode === 'view'}
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                </label>

                {(modalMode === 'create' || modalMode === 'edit') && (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addVariants}
                      onChange={(e) => setAddVariants(e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 font-medium">Add Variants</span>
                  </label>
                )}
              </div>

              {/* Variants Section */}
              {(modalMode === 'create' || modalMode === 'edit') && addVariants && (
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
                      <p className="text-sm text-gray-600">Add color, size, or material variations</p>
                    </div>
                    <Button
                      type="button"
                      onClick={addVariantToList}
                      className="bg-purple-600 hover:bg-purple-700"
                      size="sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Variant
                    </Button>
                  </div>

                  {variants.length === 0 ? (
                    <div className="text-center py-8 bg-purple-50 rounded-lg border-2 border-dashed border-purple-300">
                      <div className="text-4xl mb-2">🎨</div>
                      <p className="text-gray-600 mb-4">No variants added yet</p>
                      <Button
                        type="button"
                        onClick={addVariantToList}
                        className="bg-purple-600 hover:bg-purple-700"
                        size="sm"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Variant
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {variants.map((variant, index) => (
                        <div key={index} className="border border-purple-200 rounded-lg p-4 bg-purple-50/50">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Variant {index + 1}</h4>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingVariantIndex(editingVariantIndex === index ? null : index)}
                                className="text-purple-600 hover:text-purple-900"
                              >
                                {editingVariantIndex === index ? 'Collapse' : 'Expand'}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVariant(index)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {editingVariantIndex === index ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Variant Name *
                                </label>
                                <input
                                  type="text"
                                  required={addVariants}
                                  value={variant.name}
                                  onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., Gold - Small"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  SKU *
                                </label>
                                <input
                                  type="text"
                                  required={addVariants}
                                  value={variant.sku}
                                  onChange={(e) => updateVariant(index, 'sku', e.target.value.toUpperCase())}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
                                  placeholder="e.g., PWE-001-GOLD-S"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Color
                                </label>
                                <input
                                  type="text"
                                  value={variant.color}
                                  onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., Gold, Silver"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Size
                                </label>
                                <input
                                  type="text"
                                  value={variant.size}
                                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., Small, Medium"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Material
                                </label>
                                <input
                                  type="text"
                                  value={variant.material}
                                  onChange={(e) => updateVariant(index, 'material', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="e.g., 18K Gold"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Stock *
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  required={addVariants}
                                  value={variant.stock}
                                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Price *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  required={addVariants}
                                  value={variant.price}
                                  onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="0.00"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Compare Price
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={variant.comparePrice}
                                  onChange={(e) => updateVariant(index, 'comparePrice', e.target.value)}
                                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  placeholder="0.00"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Variant Images
                                </label>
                                <ImageUpload
                                  value={variant.images}
                                  onChange={(urls) => updateVariant(index, 'images', urls)}
                                  maxImages={5}
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={variant.inStock}
                                    onChange={(e) => updateVariant(index, 'inStock', e.target.checked)}
                                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                  />
                                  <span className="ml-2 text-xs text-gray-700">In Stock</span>
                                </label>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-900">{variant.name || 'Unnamed Variant'}</span>
                                {variant.sku && (
                                  <span className="text-xs font-mono text-gray-500 bg-white px-2 py-1 rounded">
                                    {variant.sku}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-600">
                                {variant.color && getColorBadge(variant.color)}
                                {variant.size && <span>Size: {variant.size}</span>}
                                {variant.material && <span>Material: {variant.material}</span>}
                                {variant.price && <span className="font-semibold text-purple-600">{formatPrice(parseFloat(variant.price))}</span>}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {modalMode !== 'view' && (
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                    <Save className="mr-2 h-4 w-4" />
                    {modalMode === 'create' ? 'Create Product' : 'Update Product'}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={() => setShowImageModal(false)}
            />
          </div>
        </div>
      )}

      {/* Variants Modal */}
      {showVariantsModal && variantsProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Manage Variants: {variantsProduct.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  SKU: {variantsProduct.sku} • Base Price: {formatPrice(variantsProduct.price)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowVariantsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6">
              <ProductVariants 
                productId={variantsProduct.id}
                productName={variantsProduct.name}
                basePrice={variantsProduct.price}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}