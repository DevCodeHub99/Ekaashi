'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, X, Save, AlertCircle, CheckCircle, FolderTree } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  isActive: boolean
  order: number
  subcategories?: Category[]
  _count?: {
    products: number
  }
}

interface CategoryFormData {
  name: string
  description: string
  image: string
  parentId: string
  isActive: boolean
  order: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    image: '',
    parentId: '',
    isActive: true,
    order: 0
  })
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      } else {
        showNotification('error', 'Failed to fetch categories')
      }
    } catch (error) {
      showNotification('error', 'Error fetching categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      parentId: '',
      isActive: true,
      order: 0
    })
    setImageFile(null)
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success && data.data.secure_url) {
        setFormData(prev => ({ ...prev, image: data.data.secure_url }))
        showNotification('success', 'Image uploaded successfully!')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      showNotification('error', 'Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      handleImageUpload(file)
    }
  }

  const openModal = (mode: 'create' | 'edit', category?: Category) => {
    setModalMode(mode)
    setSelectedCategory(category || null)
    
    if (mode === 'create') {
      resetForm()
    } else if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        image: category.image || '',
        parentId: category.parentId || '',
        isActive: category.isActive,
        order: category.order
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedCategory(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = modalMode === 'create' 
        ? '/api/admin/categories'
        : `/api/admin/categories/${selectedCategory?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          parentId: formData.parentId || null
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', data.message || `Category ${modalMode === 'create' ? 'created' : 'updated'} successfully`)
        closeModal()
        fetchCategories()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      showNotification('error', 'An error occurred')
    }
  }

  const handleDelete = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      
      if (data.success) {
        showNotification('success', data.message)
        fetchCategories()
      } else {
        showNotification('error', data.error)
      }
    } catch (error) {
      showNotification('error', 'Failed to delete category')
    }
  }

  const renderCategory = (category: Category, level: number = 0) => (
    <div key={category.id}>
      <div className={`flex items-center justify-between py-4 px-4 border-b hover:bg-gray-50 ${level > 0 ? 'ml-8' : ''}`}>
        <div className="flex items-center space-x-3 flex-1">
          {level > 0 && (
            <div className="text-gray-400">└─</div>
          )}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-gray-900">{category.name}</span>
              {!category.isActive && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Inactive
                </span>
              )}
            </div>
            {category.description && (
              <div className="text-sm text-gray-500 mt-1">{category.description}</div>
            )}
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-xs text-gray-500">
                {category._count?.products || 0} products
              </span>
              {category.subcategories && category.subcategories.length > 0 && (
                <span className="text-xs text-gray-500">
                  {category.subcategories.length} subcategories
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openModal('edit', category)}
            className="text-amber-600 hover:text-amber-900"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(category)}
            className="text-red-600 hover:text-red-900"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {category.subcategories && category.subcategories.map(sub => renderCategory(sub, level + 1))}
    </div>
  )

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600">Manage product categories and subcategories</p>
        </div>
        <Button 
          onClick={() => openModal('create')}
          className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FolderTree className="h-5 w-5" />
            <span>Category Tree ({categories.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-600 mb-6">Start by adding your first category.</p>
              <Button 
                onClick={() => openModal('create')}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <div>
              {categories.map(category => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter category description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Category (for subcategory)
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">None (Top Level)</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id} disabled={cat.id === selectedCategory?.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to create a top-level category
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Card Image
                </label>
                
                {/* Upload Button */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                      <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 cursor-pointer transition-colors text-center">
                        {uploadingImage ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
                            <span className="text-sm text-gray-600">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="text-sm text-gray-600">Click to upload image</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Or divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  {/* URL Input */}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Or paste image URL"
                    disabled={uploadingImage}
                  />
                </div>

                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-500">
                    📐 Recommended size: 800x1000px (4:5 aspect ratio)
                  </p>
                  <p className="text-xs text-gray-500">
                    📦 Max file size: 5MB | Formats: JPG, PNG, WebP
                  </p>
                  <p className="text-xs text-gray-500">
                    🎨 This image will be displayed on the category card on the homepage
                  </p>
                </div>

                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative w-full h-40 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden">
                      <img 
                        src={formData.image} 
                        alt="Category preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          const nextEl = e.currentTarget.nextElementSibling as HTMLElement
                          if (nextEl) nextEl.classList.remove('hidden')
                        }}
                      />
                      <div className="hidden absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                        <span className="text-sm">Invalid image URL</span>
                      </div>
                      {formData.image && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  <Save className="mr-2 h-4 w-4" />
                  {modalMode === 'create' ? 'Create Category' : 'Update Category'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
