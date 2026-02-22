'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Instagram, ExternalLink } from 'lucide-react'

interface InstagramPost {
  id: string
  image: string
  caption?: string
  link?: string
}

export default function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/instagram')
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.data)
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
                Follow Us on <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instagram</span>
              </h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get inspired by our community and see how our customers style their Ekaashi jewelry
            </p>
          </div>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null // Don't show section if no posts
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-8 w-8 text-pink-600" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900">
              Follow Us on <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Instagram</span>
            </h2>
          </div>
          <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get inspired by our community and see how our customers style their Ekaashi jewelry
          </p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="group relative aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Instagram Icon Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Instagram className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Image */}
              <Image
                src={post.image}
                alt={post.caption || `Instagram post ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Link Overlay */}
              {post.link && (
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-20"
                  aria-label={`View Instagram post ${index + 1}`}
                >
                  <span className="sr-only">View on Instagram</span>
                </a>
              )}

              {/* Caption on Hover */}
              {post.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <p className="text-white text-xs line-clamp-2">{post.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Follow Button */}
        <div className="text-center mt-8 sm:mt-12">
          <a
            href="https://instagram.com/ekaashi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Instagram className="h-5 w-5" />
            Follow @ekaashi
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
