'use client'

import { useState } from 'react'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  showLoading?: boolean
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallback = <span className="text-xl">💎</span>,
  showLoading = false
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    return <div className="w-full h-full flex items-center justify-center">{fallback}</div>
  }

  return (
    <div className="w-full h-full relative">
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        style={{ 
          display: imageLoaded ? 'block' : 'none',
          transition: 'opacity 0.2s ease-in-out'
        }}
      />
      {!imageLoaded && !imageError && showLoading && (
        <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Loading...</span>
        </div>
      )}
      {!imageLoaded && !imageError && !showLoading && (
        <div className="w-full h-full flex items-center justify-center">
          {fallback}
        </div>
      )}
    </div>
  )
}