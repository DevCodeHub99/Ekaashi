'use client'

import React, { useState, useRef, useCallback } from 'react'

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
  children?: React.ReactNode
  fallback?: React.ReactNode
  showZoomIndicator?: boolean
}

export default function ImageZoom({ 
  src, 
  alt, 
  className = '', 
  zoomScale = 2.5,
  children,
  fallback,
  showZoomIndicator = true
}: ImageZoomProps) {
  const [isZooming, setIsZooming] = useState(false)
  const [backgroundPosition, setBackgroundPosition] = useState('0% 0%')
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => {
    if (imageLoaded && !imageError) {
      setIsZooming(true)
    }
  }, [imageLoaded, imageError])

  const handleMouseLeave = useCallback(() => {
    setIsZooming(false)
    setBackgroundPosition('0% 0%')
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !imageLoaded || imageError) return

    const rect = imageRef.current.getBoundingClientRect()
    
    // Calculate mouse position relative to the image container
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Convert to percentage (0-100%)
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100
    
    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, xPercent))
    const clampedY = Math.max(0, Math.min(100, yPercent))
    
    setBackgroundPosition(`${clampedX}% ${clampedY}%`)
  }, [imageLoaded, imageError])

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!imageLoaded || imageError) return

    // Toggle zoom with Enter or Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsZooming(prev => !prev)
    }

    // Arrow keys to move zoom position
    if (isZooming && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault()
      const [currentX, currentY] = backgroundPosition.split(' ').map(v => parseFloat(v))
      const step = 10 // Move 10% at a time

      let newX = currentX
      let newY = currentY

      switch (e.key) {
        case 'ArrowLeft':
          newX = Math.max(0, currentX - step)
          break
        case 'ArrowRight':
          newX = Math.min(100, currentX + step)
          break
        case 'ArrowUp':
          newY = Math.max(0, currentY - step)
          break
        case 'ArrowDown':
          newY = Math.min(100, currentY + step)
          break
      }

      setBackgroundPosition(`${newX}% ${newY}%`)
    }

    // Escape to exit zoom
    if (e.key === 'Escape' && isZooming) {
      setIsZooming(false)
      setBackgroundPosition('0% 0%')
    }
  }, [imageLoaded, imageError, isZooming, backgroundPosition])

  const handleImageLoad = useCallback(() => {
    // Only mark as loaded if src is valid
    if (src && src.trim() !== '' && !src.includes('placeholder')) {
      setImageLoaded(true)
      setImageError(false)
    } else {
      setImageLoaded(false)
      setImageError(true)
    }
  }, [src])

  const handleImageError = useCallback(() => {
    setImageLoaded(false)
    setImageError(true)
  }, [])

  // Check if we should show zoom functionality
  const shouldShowZoom = imageLoaded && !imageError && src && src.trim() !== '' && !src.includes('placeholder')
  const shouldShowFallback = !src || src.trim() === '' || src.includes('placeholder') || imageError || !imageLoaded

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden image-zoom-container ${shouldShowZoom ? 'cursor-crosshair' : 'cursor-pointer'} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onKeyDown={handleKeyDown}
      tabIndex={shouldShowZoom ? 0 : -1}
      role="button"
      aria-label={`${alt}. Press Enter to zoom, arrow keys to navigate when zoomed, Escape to exit zoom.`}
    >
      {/* Normal Image */}
      <div 
        className={`w-full h-full bg-cover bg-center transition-opacity duration-200 ${
          isZooming && shouldShowZoom ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: imageLoaded && !imageError && src ? `url(${src})` : 'none',
        }}
      >
        {/* Actual img tag for loading detection and accessibility - only render if src exists */}
        {src && src.trim() !== '' && !src.includes('placeholder') && (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover opacity-0" 
            draggable={false}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        {/* Fallback content when image fails to load or is missing */}
        {shouldShowFallback && fallback && (
          <div className="absolute inset-0">
            {fallback}
          </div>
        )}
      </div>

      {/* Zoomed Image */}
      {shouldShowZoom && (
        <div
          className={`absolute inset-0 bg-cover image-zoom-bg transition-opacity duration-200 ${
            isZooming ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomScale * 100}%`,
            backgroundPosition: backgroundPosition,
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden="true"
        />
      )}

      {/* Zoom indicator */}
      {shouldShowZoom && showZoomIndicator && (
        <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
          </svg>
        </div>
      )}

      {/* Children overlay (badges, buttons, etc.) */}
      {children && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {children}
        </div>
      )}
    </div>
  )
}