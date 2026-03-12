export const dynamic = 'force-dynamic'

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface RecentOrder {
  id: string
  email: string
  firstName: string
  lastName: string
  total: number
  status: string
  createdAt: string
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

function RecentOrdersList() {
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch('/api/admin/orders')
        const data = await response.json()
        if (data.success) {
          setRecentOrders(data.data.slice(0, 5)) // Show only 5 recent orders
        }
      } catch (error) {
        console.error('Error fetching recent orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentOrders()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800'
      case 'DELIVERED':
        return 'bg-green-100 text-green-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-600">Loading orders...</p>
      </div>
    )
  }

  if (recentOrders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p className="text-lg font-medium">No orders yet</p>
        <p className="text-sm">Orders will appear here when customers make purchases</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recentOrders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-medium text-sm">#{order.id.slice(-8).toUpperCase()}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{order.firstName} {order.lastName}</p>
            <p className="text-xs text-gray-500">
              {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-sm">{formatPrice(Number(order.total))}</p>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    // Fetch stats from API
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsResponse = await fetch('/api/admin/products')
        const productsData = await productsResponse.json()
        
        // Fetch orders data
        const ordersResponse = await fetch('/api/admin/orders')
        const ordersData = await ordersResponse.json()
        
        if (productsData.success) {
          setStats(prev => ({
            ...prev,
            totalProducts: productsData.total || 0
          }))
        }
        
        if (ordersData.success) {
          const orders = ordersData.data
          const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.total), 0)
          const uniqueCustomers = new Set(orders.map((order: any) => order.email)).size
          
          setStats(prev => ({
            ...prev,
            totalOrders: orders.length,
            totalCustomers: uniqueCustomers,
            totalRevenue: totalRevenue
          }))
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Ekaashi Admin</h2>
        <p className="text-amber-100">Manage your jewelry store with ease</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalProducts}</div>
            <p className="text-xs text-gray-600">
              Active jewelry items
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
            <p className="text-xs text-gray-600">
              Customer orders
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</div>
            <p className="text-xs text-gray-600">
              Registered users
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-gray-600">
              Total earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5 text-amber-600" />
                Recent Orders
              </div>
              <Link href="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700">
                View All
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentOrdersList />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5 text-amber-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Link href="/admin/products">
                <Button className="w-full justify-start h-auto p-4 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200">
                  <Package className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Products</div>
                    <div className="text-sm opacity-75">Add, edit, or remove jewelry items</div>
                  </div>
                </Button>
              </Link>
              
              <Link href="/admin/banners">
                <Button className="w-full justify-start h-auto p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
                  <ShoppingBag className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Manage Banners</div>
                    <div className="text-sm opacity-75">Update homepage banners and promotions</div>
                  </div>
                </Button>
              </Link>

              <Link href="/admin/orders">
                <Button className="w-full justify-start h-auto p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
                  <Users className="h-6 w-6 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">View Orders</div>
                    <div className="text-sm opacity-75">Manage customer orders and status</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Website</div>
                <div className="text-sm text-gray-600">Online</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">Database</div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">API</div>
                <div className="text-sm text-gray-600">Operational</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}