'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Edit, Trash2, X, Save, AlertCircle, CheckCircle, Instagram, Upload, ExternalLink } from 'lucide-react'
import Image from 'next/image'

interface InstagramPost {
  id: string
  image: string
  caption?: string
  link?: string
  isActive: boolean
  order: number
}

interface FormData {
  image: string
  caption: string
  link: string
  isActive: boolean
  order: number
}

export default function AdminInstagramPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedPost, setSelectedPost] = useState<InstagramPost | null>(null)
  const [formData, setFormData] = useState<FormData>({
    image: '',
    caption: '',
    link: '',
    isActive: true,
    order: 0
  })
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/instagram')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      } else {
        showNotification('error', 'Failed to fetch Instagram posts')
      }
    } catch (error) {
      showNotification('error', 'Error fetching Instagram posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const resetForm = () => {
    setFormData({
      image: '',
      caption: '',
      link: '',
      isActive: true,
      order: 0
    })
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'Image size must be less than 5MB')
      return
    }

    setUploadingImage(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
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
      showNotification('error', 'Failed to upload image')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  const openModal = (mode: 'create' | 'edit', post?: InstagramPost) => {
    setModalMode(mode)
    setSelectedPost(post || null)
    
    if (mode === 'create') {
      resetForm()
    } else if (post) {
      setFormData({
        image: post.image,
        caption: post.caption || '',
        link: post.link || '',
        isActive: post.isActive,
        order: post.order
      })
    }
    
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPost(null)
    resetForm()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = modalMode === 'create' 
        ? '/api/admin/instagram'
        : `/api/admin/instagram/${selectedPost?.id}`
      
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        showNotification('success', `Instagram post ${modalMode === 'create' ? 'created' : 'updated'} successfully!`)
        fetchPosts()
        closeModal()
      } else {
        showNotification('error', data.error || 'Operation failed')
      }
    } catch (error) {
      showNotification('error', 'An error occurred')
    }
  }

  const handleDelete = async (post: InstagramPost) => {
    if (!confirm(`Are you sure you want to delete this Instagram post?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/instagram/${post.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        showNotification('success', 'Instagram post deleted successfully!')
        fetchPosts()
      } else {
        showNotification('error', 'Failed to delete Instagram post')
      }
    } catch (error) {
      showNotification('error', 'An error occurred')
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Instagram className="h-6 w-6 text-pink-600" />
            Instagram Feed
          </h1>
          <p className="text-gray-600">Manage Instagram posts displayed on homepage</p>
        </div>
        <Button 
          onClick={() => openModal('create')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Instagram Post
        </Button>
      </div>

      {/* Posts Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Instagram Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Instagram className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Instagram Posts</h3>
              <p className="text-gray-600 mb-6">Start by adding your first Instagram post.</p>
              <Button 
                onClick={() => openModal('create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-100">
                    <Image
                      src={post.image}
                      alt={post.caption || 'Instagram post'}
                      fill
                      className="object-cover"
                    />
                    {!post.isActive && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Inactive</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {post.caption && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{post.caption}</p>
                    )}
                    {post.link && (
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-pink-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View on Instagram
                      </a>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <span className="text-xs text-gray-500">Order: {post.order}</span>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openModal('edit', post)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                {modalMode === 'create' ? 'Add Instagram Post' : 'Edit Instagram Post'}
              </h2>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image *
                </label>
                
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
                      <div className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-500 cursor-pointer transition-colors text-center">
                        {uploadingImage ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600"></div>
                            <span className="text-sm text-gray-600">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Upload className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">Click to upload image</span>
                          </div>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Or paste image URL"
                    disabled={uploadingImage}
                  />
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  📐 Recommended: Square images (1080x1080px)
                </p>

                {formData.image && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Optional caption for the post"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Link
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://instagram.com/p/..."
                />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!formData.image}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {modalMode === 'create' ? 'Create Post' : 'Update Post'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
