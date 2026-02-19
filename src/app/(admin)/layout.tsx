'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  Users, 
  Settings,
  LogOut,
  ShoppingCart,
  FolderTree
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Products',
    href: '/admin/products',
    icon: Package,
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: FolderTree,
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: ImageIcon,
  },
  {
    title: 'Orders',
    href: '/admin/orders',
    icon: Users,
  },
  {
    title: 'Abandoned Carts',
    href: '/admin/abandoned-carts',
    icon: ShoppingCart,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/auth/signin')
      return
    }

    setIsLoading(false)
  }, [session, status, router])

  const handleLogout = () => {
    router.push('/auth/signin')
  }

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null // Will redirect
  }

  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/admin'

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold text-amber-600">Ekaashi Admin</h2>
          <p className="text-sm text-gray-600">Jewelry Store</p>
          <p className="text-xs text-gray-500 mt-1">Welcome, {session.user?.name || session.user?.email}</p>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-amber-50 text-amber-600 border-r-2 border-amber-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 w-64 p-6">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-600 hover:text-amber-600"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-900">
              {sidebarItems.find(item => item.href === pathname)?.title || 'Admin'}
            </h1>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}