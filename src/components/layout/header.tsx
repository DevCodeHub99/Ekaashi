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
  const { data: session, status } = useSession()
  const { totalItems } = useCart()

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
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-gray-200 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Mobile menu button - Left side on mobile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
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
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            {/* Wishlist Icon with Count */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold">
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
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
                
                {isUserMenuOpen && (
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
                )}
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-amber-600 cursor-pointer h-9 w-9 sm:h-10 sm:w-10">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 h-4 w-4 rounded-full bg-amber-600 text-[10px] sm:text-xs text-white flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation - Slide from Left */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="text-2xl font-bold text-amber-600">EKAASHI</div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-600 hover:text-amber-600 cursor-pointer"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Sidebar Content */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="flex flex-col space-y-1 px-4">
              {/* Search Button */}
              <button
                onClick={() => {
                  setIsMenuOpen(false)
                  setIsSearchOpen(true)
                }}
                className="flex items-center gap-3 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors px-4 py-3 rounded-lg cursor-pointer"
              >
                <Search className="h-5 w-5" />
                <span>Search Products</span>
              </button>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <Link 
                href="/products" 
                className="text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                All
              </Link>
              <Link 
                href="/deals" 
                className="text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link 
                href="/new-arrivals" 
                className="text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                New Arrivals ✨
              </Link>
              
              {/* Categories Toggle Section */}
              <div className="pt-2">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="w-full flex items-center justify-between text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-amber-50 transition-colors px-4 py-3 rounded-lg cursor-pointer"
                >
                  <span>Categories</span>
                  {isCategoriesOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
                
                {/* Collapsible Categories List */}
                {isCategoriesOpen && (
                  <div className="mt-1 ml-4 space-y-1" onClick={() => setIsMenuOpen(false)}>
                    <CategoryNav isMobile={true} />
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Sidebar Footer - Auth Links */}
          {!session && (
            <div className="border-t border-gray-200 p-4 space-y-2">
              <Link 
                href="/auth/signin" 
                className="block w-full text-center bg-amber-600 hover:bg-amber-700 text-white font-medium px-4 py-3 rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                href="/auth/signup" 
                className="block w-full text-center border-2 border-amber-600 text-amber-600 hover:bg-amber-50 font-medium px-4 py-3 rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay - Click outside to close menus */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" 
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMenuOpen(false)
          }}
        ></div>
      )}

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}