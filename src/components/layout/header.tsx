'use client'

import Link from 'next/link'
import { ShoppingBag, Search, Menu, User, Heart, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/contexts/cart-context'
import CategoryNav from './CategoryNav'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { data: session, status } = useSession()
  const { totalItems } = useCart()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="text-2xl font-bold text-amber-600">
              EKAASHI
            </div>
          </Link>

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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hidden md:flex text-gray-600 hover:text-amber-600 cursor-pointer">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 cursor-pointer">
              <Heart className="h-5 w-5" />
            </Button>
            
            {/* User Menu */}
            {status === 'loading' ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session ? (
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-gray-600 hover:text-amber-600 cursor-pointer"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <User className="h-5 w-5" />
                </Button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session.user?.name}</p>
                      <p className="text-xs text-gray-500">{session.user?.email}</p>
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
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-amber-600 cursor-pointer">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-amber-600 cursor-pointer">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-600 text-xs text-white flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-gray-600 hover:text-amber-600 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors px-2 py-1 cursor-pointer">
                All
              </Link>
              <Link href="/deals" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors px-2 py-1 cursor-pointer">
                Deals
              </Link>
              <Link href="/new-arrivals" className="text-sm font-medium text-gray-700 hover:text-amber-600 transition-colors px-2 py-1 cursor-pointer">
                New Arrivals
              </Link>
              <CategoryNav isMobile={true} />
              
              {/* Mobile Auth Links */}
              {!session && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <Link href="/auth/signin" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors px-2 py-1 block cursor-pointer">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors px-2 py-1 block cursor-pointer">
                    Create Account
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
      
      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        ></div>
      )}
    </header>
  )
}