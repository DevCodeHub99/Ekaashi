'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from './button'
import Image from 'next/image'

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  image: string
  isActive: boolean
  order: number
}

export default function Carousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners')
        const data = await response.json()
        
        if (data.success && data.data.length > 0) {
          setBanners(data.data)
        } else {
          // Fallback to default banners if no banners in database
          setBanners([
            {
              id: 'default-1',
              title: "Exquisite Jewelry Collection",
              subtitle: "Discover Timeless Elegance",
              description: "Explore our handcrafted jewelry pieces that celebrate your unique style",
              buttonText: "SHOP NOW",
              buttonLink: "/products",
              image: "",
              isActive: true,
              order: 0
            }
          ])
        }
      } catch (error) {
        console.error('Error fetching banners:', error)
        // Fallback banner
        setBanners([
          {
            id: 'fallback-1',
            title: "Welcome to Ekaashi",
            subtitle: "Premium Jewelry Collection",
            description: "Discover beautiful jewelry pieces crafted with love",
            buttonText: "EXPLORE",
            buttonLink: "/products",
            image: "",
            isActive: true,
            order: 0
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-slide functionality
  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden rounded-lg shadow-lg bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden rounded-lg shadow-lg bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">💎</div>
          <h2 className="text-2xl font-bold mb-2">Welcome to Ekaashi</h2>
          <p className="text-lg opacity-90">Premium Jewelry Collection</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] overflow-hidden rounded-lg shadow-lg">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="w-full h-full relative">
            {/* Background Image */}
            {banner.image ? (
              <div className="absolute inset-0">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                  onError={(e) => {
                    console.warn('Failed to load banner image:', banner.image)
                    // Hide the image on error and show gradient background
                    e.currentTarget.style.display = 'none'
                  }}
                />
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
            ) : (
              // Fallback gradient background
              <div className="absolute inset-0 bg-gradient-to-r from-amber-900 via-orange-900 to-yellow-900">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="relative h-full flex items-center z-10">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left Content */}
                  <div className="text-white space-y-4 sm:space-y-6 text-center lg:text-left">
                    <div className="space-y-2 sm:space-y-4">
                      <div className="inline-block">
                        <div className="text-xl sm:text-2xl font-bold text-amber-200 mb-1 sm:mb-2">
                          EKAASHI
                        </div>
                        <div className="text-xs sm:text-sm text-amber-100 uppercase tracking-wider">
                          Premium Jewelry Collection
                        </div>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-6xl font-light leading-tight">
                        {banner.title}
                      </h1>
                      
                      {banner.subtitle && (
                        <p className="text-lg sm:text-xl lg:text-2xl font-light text-white/90">
                          {banner.subtitle}
                        </p>
                      )}
                      
                      {banner.description && (
                        <p className="text-white/80 max-w-md mx-auto lg:mx-0 text-sm sm:text-base">
                          {banner.description}
                        </p>
                      )}
                    </div>
                    
                    {banner.buttonText && banner.buttonLink && (
                      <Button 
                        asChild 
                        className="bg-white text-gray-900 hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-none shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <a href={banner.buttonLink}>
                          {banner.buttonText}
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  {/* Right Content - Decorative Element */}
                  <div className="relative h-32 sm:h-48 lg:h-full flex items-center justify-center">
                    <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
                      <div className="aspect-square bg-white/10 backdrop-blur-sm rounded-full border border-white/20 flex items-center justify-center">
                        <div className="text-4xl sm:text-6xl lg:text-8xl opacity-60">💎</div>
                      </div>
                      
                      {/* Floating Elements */}
                      <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-amber-400/30 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-lg sm:text-xl lg:text-2xl">✨</span>
                      </div>
                      <div className="absolute -bottom-2 -left-2 sm:-bottom-4 sm:-left-4 w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-orange-400/30 rounded-full flex items-center justify-center animate-pulse delay-1000">
                        <span className="text-sm sm:text-lg lg:text-xl">🌸</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm w-8 h-8 sm:w-10 sm:h-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  )
}