'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, User, Heart, LogOut, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/cart-context'
import CategoryNav from './CategoryNav'
import SearchModal from '@/components/ui/search-modal'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { data: session, status } = useSession()
  const { totalItems } = useCart()

  // Handle scroll behavior for collapsing header
  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          
          // Show/hide header based on scroll direction
          if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down & past threshold
            setIsHeaderVisible(false)
          } else {
            // Scrolling up
            setIsHeaderVisible(true)
          }
          
          // Add shadow when scrolled
          setIsScrolled(currentScrollY > 10)
          setLastScrollY(currentScrollY)
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Fetch combined counts (cart + wishlist) in a single request
  useEffect(() => {
    fetchCounts()
    
    // Listen for updates
    const handleWishlistUpdate = () => fetchCounts()
    const handleCartUpdate = () => fetchCounts()
    
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)
    window.addEventListener('cartUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [session])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const fetchCounts = async () => {
    try {
      const response = await fetch('/api/user/counts')
      const data = await response.json()
      if (data.success) {
        setWishlistCount(data.data.wishlist)
        // Cart count is managed by CartContext, but we could sync it here if needed
      }
    } catch (error) {
      console.error('Error fetching counts:', error)
    }
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[55] w-full bg-white border-b border-gray-200 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    } ${
      isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Mobile menu button - Left side on mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </Button>
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
              <div className="text-xl sm:text-2xl font-bold text-amber-600">
                EKAASHI
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors cursor-pointer">
              All
            </Link>
            <Link href="/deals" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors cursor-pointer">
              Deals
            </Link>
            <Link href="/new-arrivals" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors cursor-pointer">
              New Arrivals
            </Link>
            <CategoryNav />
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </Button>
            
            {/* Wishlist Icon with Count */}
            <Link href="/wishlist">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold" aria-label={`${wishlistCount} items in wishlist`}>
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* User Menu */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Button>
                
                {isUserMenuOpen && (
                  <>
                    {/* Invisible overlay for click-outside on desktop */}
                    <div 
                      className="fixed inset-0 z-30"
                      onClick={() => setIsUserMenuOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    
                    {session.user?.role === 'ADMIN' && (
                      <Link 
                        href="/admin" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link 
                      href="/wishlist" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Wishlist
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                  </>
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                  aria-label="Sign in"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
                aria-label={`Shopping cart, ${totalItems} items`}
              >
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold" aria-label={`${totalItems} items in cart`}>
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation - 80% width */}
      {isMenuOpen && (
        <>
          {/* Transparent overlay on the right */}
          <div 
            className="lg:hidden fixed inset-0 z-[9998]"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="lg:hidden fixed inset-y-0 left-0 w-[80%] z-[9999] bg-gray-50 shadow-2xl" style={{ height: '100vh', minHeight: '100vh' }}>
            <div className="flex flex-col h-full" style={{ height: '100vh' }}>
              {/* Sidebar Header */}
              <div className="flex-shrink-0 flex items-center justify-between px-5 py-6 border-b border-gray-200 bg-gray-50" style={{ minHeight: '80px' }}>
                <div className="text-2xl font-bold text-amber-600">EKAASHI</div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-600 hover:text-gray-900 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="h-7 w-7" />
                </button>
              </div>

              {/* Sidebar Content - Scrollable */}
              <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50">
                {/* Search Button */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    setIsSearchOpen(true)
                  }}
                  className="flex items-center gap-3 w-full text-left text-base font-normal py-4 border-b border-gray-300"
                  style={{ color: '#374151' }}
                >
                  <Search className="h-5 w-5" style={{ color: '#374151' }} />
                  <span>Search Products</span>
                </button>
                
                <Link 
                  href="/products" 
                  className="block text-base font-normal py-4 border-b border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: '#374151' }}
                >
                  All
                </Link>
                
                <Link 
                  href="/deals" 
                  className="block text-base font-normal py-4 border-b border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: '#374151' }}
                >
                  Deals
                </Link>
                
                <Link 
                  href="/new-arrivals" 
                  className="flex items-center gap-2 text-base font-normal py-4 border-b border-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: '#374151' }}
                >
                  <span>New Arrivals</span>
                  <span className="text-base">✨</span>
                </Link>
                
                {/* Categories with Dropdown */}
                <div className="border-b border-gray-300">
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="w-full flex items-center justify-between text-base font-normal py-4"
                    style={{ color: '#374151' }}
                  >
                    <span>Categories</span>
                    {isCategoriesOpen ? (
                      <ChevronUp className="h-5 w-5" style={{ color: '#374151' }} />
                    ) : (
                      <ChevronDown className="h-5 w-5" style={{ color: '#374151' }} />
                    )}
                  </button>
                  
                  {/* Collapsible Categories */}
                  {isCategoriesOpen && (
                    <div className="pb-2 pl-4 space-y-1 bg-gray-50">
                      <Link 
                        href="/category/necklaces" 
                        className="block text-sm font-normal py-3"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: '#4B5563' }}
                      >
                        Necklaces
                      </Link>
                      <Link 
                        href="/category/earrings" 
                        className="block text-sm font-normal py-3"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: '#4B5563' }}
                      >
                        Earrings
                      </Link>
                      <Link 
                        href="/category/rings" 
                        className="block text-sm font-normal py-3"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: '#4B5563' }}
                      >
                        Rings
                      </Link>
                      <Link 
                        href="/category/bracelets" 
                        className="block text-sm font-normal py-3"
                        onClick={() => setIsMenuOpen(false)}
                        style={{ color: '#4B5563' }}
                      >
                        Bracelets
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Footer - Auth Links */}
              <div className="flex-shrink-0 border-t border-gray-200 px-5 py-4 space-y-3 bg-gray-50">
                {!session ? (
                  <>
                    <Link 
                      href="/auth/signin" 
                      className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="block w-full text-center border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false)
                      handleSignOut()
                    }}
                    className="w-full text-center border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}