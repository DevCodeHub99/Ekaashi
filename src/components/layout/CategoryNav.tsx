'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoryNav({ isMobile = false }: { isMobile?: boolean }) {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  if (categories.length === 0) {
    return null
  }

  if (isMobile) {
    return (
      <>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.slug}`}
            className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors px-2 py-1 cursor-pointer"
          >
            {category.name}
          </Link>
        ))}
      </>
    )
  }

  return (
    <>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors cursor-pointer"
        >
          {category.name}
        </Link>
      ))}
    </>
  )
}
