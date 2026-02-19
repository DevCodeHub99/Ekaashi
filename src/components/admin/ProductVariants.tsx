'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, X, Save, AlertCircle, CheckCircle } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'
import { formatPrice } from '@/lib/utils'

interface ProductVariant {
  id: string
  sku: string
  name: string
  attributes: {
    color?: string
    size?: string
    material?: string
    [key: string]: string | undefined
  }
  price: number
  comparePrice?: number
  images: string[]
  inStock: boolean
  stock: number
}

interface ProductVariantsProps {
  productId: string
  productName: string
  basePrice: number
}

export default function ProductVariants({ productId, productName, basePrice }: ProductVariantsProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    color: '',
    size: '',
    material: '',
    price: basePrice.toString(),
    comparePrice: '',
    images: [] as string[],
    inStock: true,
    stock: 0
  })
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const fetchVariants = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/products/${productId}/variants`)
      const result = await response.json()
      
      if (result.success) {
        setVariants(result.data)
      }
    } catch (error) {
      console.error('Error fetching variants:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVariants()
  }, [productId])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      color: '',
      size: '',
      material: '',
      price: basePrice.toString(),
      comparePrice: '',
      images: [],
      inStock: true,
      stock: 0
    })
  }

  const openModal = (mode: 'create' | 'edit', variant?: ProductVariant) => {
    setModalMode(mode)
    setSelectedVariant(variant || null)
    
    if (mode === 'create') {
      resetForm()
    } else if (variant) {
      setFormData({
        sku: variant.sku,
        name: variant.name,
        color: variant.attributes.color || '',
        size: variant.attributes.size || '',
        material: variant.attributes.material || '',
        price: variant.price.toString(),
        comparePrice: variant.comparePrice?.toString() || '',
        images: variant.images || [],
        inStock: variant.inStock,
        stock: variant.stock
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedVariant(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const attributes: any = {}
      if (formData.color) attributes.color = formData.color
      if (formData.size) attributes.size = formData.size
      if (formData.material) attributes.material = formData.material

      const url = modalMode === 'create' 
        ? `/api/admin/products/${productId}/variants`
        : `/api/admin/products/${productId}/variants/${selectedVariant?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sku: formData.sku.toUpperCase(),
          name: formData.name,
          attributes,
          price: parseFloat(formData.price),
          comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
          images: formData.images,
          inStock: formData.inStock,
          stock: formData.stock
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', data.message)
        closeModal()
        fetchVariants()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      showNotification('error', 'An error occurred')
    }
  }

  const handleDelete = async (variant: ProductVariant) => {
    if (!confirm(`Are you sure you want to delete variant "${variant.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/variants/${variant.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', data.message)
        fetchVariants()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      showNotification('error', 'Failed to delete variant')
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
        <span className={`w-4 h-4 rounded-full ${bgColor}`}></span>
        <span className="capitalize">{color}</span>
      </span>
    )
  }

  return (
    <div className="space-y-4">
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
          <h3 className="text-lg font-semibold text-gray-900">Product Variants</h3>
          <p className="text-sm text-gray-600">Manage color, size, and other variations</p>
        </div>
        <Button 
          onClick={() => openModal('create')}
          className="bg-amber-600 hover:bg-amber-700"
          size="sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Variant
        </Button>
      </div>

      {/* Variants List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto"></div>
        </div>
      ) : variants.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-4xl mb-2">🎨</div>
          <p className="text-gray-600 mb-4">No variants yet</p>
          <Button 
            onClick={() => openModal('create')}
            className="bg-amber-600 hover:bg-amber-700"
            size="sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Variant
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {variants.map((variant) => (
            <div key={variant.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4 flex-1">
                {variant.images[0] && (
                  <img 
                    src={variant.images[0]} 
                    alt={variant.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{variant.name}</span>
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {variant.sku}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    {variant.attributes.color && (
                      <div className="flex items-center space-x-1">
                        <span className="text-gray-500">Color:</span>
                        {getColorBadge(variant.attributes.color)}
                      </div>
                    )}
                    {variant.attributes.size && (
                      <div>
                        <span className="text-gray-500">Size:</span> {variant.attributes.size}
                      </div>
                    )}
                    {variant.attributes.material && (
                      <div>
                        <span className="text-gray-500">Material:</span> {variant.attributes.material}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="font-semibold text-amber-600">{formatPrice(variant.price)}</span>
                    {variant.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">{formatPrice(variant.comparePrice)}</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      variant.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {variant.inStock ? `Stock: ${variant.stock}` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openModal('edit', variant)}
                  className="text-amber-600 hover:text-amber-900"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(variant)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' ? 'Add New Variant' : 'Edit Variant'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Gold - Small"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent uppercase"
                    placeholder="e.g., PWE-001-GOLD-S"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Gold, Silver, Rose Gold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., Small, Medium, Large"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="e.g., 18K Gold, Sterling Silver"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0"
                  />
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
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                    value={formData.comparePrice}
                    onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <ImageUpload
                  value={formData.images}
                  onChange={(urls) => setFormData({ ...formData, images: urls })}
                  maxImages={5}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">In Stock</span>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  <Save className="mr-2 h-4 w-4" />
                  {modalMode === 'create' ? 'Create Variant' : 'Update Variant'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
