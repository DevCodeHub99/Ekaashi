'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [data, setData] = useState<any>(null)

  const handleSeed = async () => {
    setStatus('loading')
    setMessage('Seeding database...')
    
    try {
      const response = await fetch('/api/seed-mongodb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStatus('success')
        setMessage('✅ Database seeded successfully!')
        setData(result.counts)
      } else {
        setStatus('error')
        setMessage('❌ Seeding failed: ' + (result.error || 'Unknown error'))
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const handleCheckConnection = async () => {
    setStatus('loading')
    setMessage('Checking connection...')
    
    try {
      const response = await fetch('/api/check-connection')
      const html = await response.text()
      
      if (html.includes('Database connection is working')) {
        setStatus('success')
        setMessage('✅ MongoDB connected!')
      } else {
        setStatus('error')
        setMessage('❌ MongoDB connection failed!')
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Error checking connection')
    }
  }

  const handleCheckProducts = async () => {
    setStatus('loading')
    setMessage('Checking products...')
    
    try {
      const response = await fetch('/api/debug-products')
      const result = await response.json()
      
      if (result.success) {
        setStatus('success')
        setMessage(`✅ Found ${result.data.totalProducts} products in database`)
        setData(result.data)
      } else {
        setStatus('error')
        setMessage('❌ Error checking products')
      }
    } catch (error) {
      setStatus('error')
      setMessage('❌ Error: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            🗄️ Database Setup
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Ekaashi Jewelry Store - Admin Tools
          </p>

          <div className="space-y-4 mb-8">
            <Button
              onClick={handleCheckConnection}
              disabled={status === 'loading'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
            >
              1️⃣ Check MongoDB Connection
            </Button>

            <Button
              onClick={handleCheckProducts}
              disabled={status === 'loading'}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg"
            >
              2️⃣ Check Products Count
            </Button>

            <Button
              onClick={handleSeed}
              disabled={status === 'loading'}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-6 text-lg font-bold"
            >
              3️⃣ Seed Database (25 Products)
            </Button>
          </div>

          {status !== 'idle' && (
            <div className={`p-6 rounded-lg ${
              status === 'loading' ? 'bg-blue-50 border-blue-200' :
              status === 'success' ? 'bg-green-50 border-green-200' :
              'bg-red-50 border-red-200'
            } border-2`}>
              <p className={`text-lg font-medium ${
                status === 'loading' ? 'text-blue-900' :
                status === 'success' ? 'text-green-900' :
                'text-red-900'
              }`}>
                {message}
              </p>

              {data && (
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-auto">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}

              {status === 'success' && message.includes('seeded') && (
                <div className="mt-4">
                  <Button
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    ✅ Go to Homepage
                  </Button>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📋 Instructions:</h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Click "Check MongoDB Connection" first</li>
              <li>If connected, click "Check Products Count"</li>
              <li>If 0 products, click "Seed Database"</li>
              <li>Wait 5-10 seconds for seeding to complete</li>
              <li>Click "Go to Homepage" to see products!</li>
            </ol>
          </div>

          <div className="mt-6 text-center">
            <a 
              href="/"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              ← Back to Homepage
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
