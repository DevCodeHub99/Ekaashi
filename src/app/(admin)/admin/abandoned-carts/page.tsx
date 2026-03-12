'use client'

import { useState, useEffect } from 'react'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Mail, Eye, CheckCircle, Clock, DollarSign, ShoppingCart } from 'lucide-react'

interface AbandonedCart {
  id: string
  userId?: string
  sessionId?: string
  email?: string
  cartData: any[]
  totalItems: number
  totalValue: number
  emailSent: boolean
  recovered: boolean
  createdAt: string
  updatedAt: string
}

export default function AbandonedCartsPage() {
  const [carts, setCarts] = useState<AbandonedCart[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'sent'>('all')
  const [selectedCart, setSelectedCart] = useState<AbandonedCart | null>(null)

  useEffect(() => {
    fetchAbandonedCarts()
  }, [filter])

  const fetchAbandonedCarts = async () => {
    try {
      setLoading(true)
      const emailSent = filter === 'pending' ? 'false' : filter === 'sent' ? 'true' : null
      const url = `/api/cart/abandoned${emailSent !== null ? `?emailSent=${emailSent}` : ''}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        setCarts(data.data)
      }
    } catch (error) {
      console.error('Error fetching abandoned carts:', error)
    } finally {
      setLoading(false)
    }
  }

  const markEmailSent = async (cartId: string) => {
    try {
      const response = await fetch('/api/cart/abandoned', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, emailSent: true })
      })
      
      if (response.ok) {
        setCarts(carts.map(cart => 
          cart.id === cartId ? { ...cart, emailSent: true } : cart
        ))
      }
    } catch (error) {
      console.error('Error marking email as sent:', error)
    }
  }

  const markRecovered = async (cartId: string) => {
    try {
      const response = await fetch('/api/cart/abandoned', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartId, recovered: true })
      })
      
      if (response.ok) {
        setCarts(carts.map(cart => 
          cart.id === cartId ? { ...cart, recovered: true } : cart
        ))
      }
    } catch (error) {
      console.error('Error marking as recovered:', error)
    }
  }

  const totalValue = carts.reduce((sum, cart) => sum + Number(cart.totalValue), 0)
  const pendingCarts = carts.filter(cart => !cart.emailSent).length
  const recoveredCarts = carts.filter(cart => cart.recovered).length

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Abandoned Carts</h1>
        <p className="text-gray-600">Manage and recover abandoned shopping carts</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Carts</p>
              <p className="text-2xl font-bold text-gray-900">{carts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Email</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCarts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recovered</p>
              <p className="text-2xl font-bold text-gray-900">{recoveredCarts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            className={filter === 'all' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            All Carts
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
            className={filter === 'pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            Pending Email
          </Button>
          <Button
            variant={filter === 'sent' ? 'default' : 'outline'}
            onClick={() => setFilter('sent')}
            className={filter === 'sent' ? 'bg-amber-600 hover:bg-amber-700' : ''}
          >
            Email Sent
          </Button>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : carts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No abandoned carts found
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cart.email || 'Guest User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cart.userId ? 'Registered' : 'Guest'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cart.totalItems} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(Number(cart.totalValue))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(cart.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          cart.recovered 
                            ? 'bg-green-100 text-green-800'
                            : cart.emailSent 
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {cart.recovered ? 'Recovered' : cart.emailSent ? 'Email Sent' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCart(cart)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {!cart.emailSent && (
                          <Button
                            size="sm"
                            onClick={() => markEmailSent(cart.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Mark Sent
                          </Button>
                        )}
                        {!cart.recovered && (
                          <Button
                            size="sm"
                            onClick={() => markRecovered(cart.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Recovered
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cart Details Modal */}
      {selectedCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cart Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCart(null)}
                >
                  Close
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p><strong>Customer:</strong> {selectedCart.email || 'Guest User'}</p>
                  <p><strong>Total Items:</strong> {selectedCart.totalItems}</p>
                  <p><strong>Total Value:</strong> {formatPrice(Number(selectedCart.totalValue))}</p>
                  <p><strong>Created:</strong> {new Date(selectedCart.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cart Items:</h4>
                  <div className="space-y-2">
                    {selectedCart.cartData.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}