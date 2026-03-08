'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  showLoading?: boolean
  priority?: boolean
  width?: number
  height?: number
}

export default function ProductImage({ 
  src, 
  alt, 
  className = "w-full h-full object-cover",
  fallback = <span className="text-xl">💎</span>,
  showLoading = false,
  priority = false,
  width = 400,
  height = 400
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  // If no src provided or image failed to load, show fallback
  if (!src || imageError) {
    return <div className="w-full h-full flex items-center justify-center">{fallback}</div>
  }

  return (
    <div className="w-full h-full relative">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        priority={priority}
        quality={85}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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