'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { getSessionId } from '@/lib/session'

export interface CartItem {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  quantity: number
  category: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  isLoading: boolean
  isSyncing: boolean
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SYNC_CART'; payload: CartItem[] }

interface CartContextType extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload }
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id)
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
        
        return {
          ...state,
          items: updatedItems,
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      } else {
        const newItem = { ...action.payload, quantity: 1 }
        return {
          ...state,
          items: [...state.items, newItem],
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + action.payload.price
        }
      }
    }
    
    case 'REMOVE_ITEM': {
      const itemToRemove = state.items.find(item => item.id === action.payload)
      if (!itemToRemove) return state
      
      const updatedItems = state.items.filter(item => item.id !== action.payload)
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems - itemToRemove.quantity,
        totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
      }
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload
      const existingItem = state.items.find(item => item.id === id)
      
      if (!existingItem) return state
      
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: id })
      }
      
      const quantityDiff = quantity - existingItem.quantity
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
      
      return {
        ...state,
        items: updatedItems,
        totalItems: state.totalItems + quantityDiff,
        totalPrice: state.totalPrice + (existingItem.price * quantityDiff)
      }
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0
      }
    
    case 'LOAD_CART':
    case 'SYNC_CART': {
      const totalItems = action.payload.reduce((sum, item) => sum + item.quantity, 0)
      const totalPrice = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      return {
        ...state,
        items: action.payload,
        totalItems,
        totalPrice,
        isLoading: false,
        isSyncing: false
      }
    }
    
    default:
      return state
  }
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: true,
  isSyncing: false
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { data: session, status } = useSession()

  // Sync cart with database
  const syncCart = async () => {
    if (status === 'loading') return
    
    dispatch({ type: 'SET_SYNCING', payload: true })
    
    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/cart?sessionId=${sessionId}`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          dispatch({ type: 'SYNC_CART', payload: data.data })
          // Update localStorage
          localStorage.setItem('ekaashi-cart', JSON.stringify(data.data))
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error)
      // Fallback to localStorage
      const savedCart = localStorage.getItem('ekaashi-cart')
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart)
          dispatch({ type: 'LOAD_CART', payload: cartItems })
        } catch (error) {
          console.error('Error loading cart from localStorage:', error)
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }
  }

  // Load cart on mount and when session changes
  useEffect(() => {
    syncCart()
  }, [status])

  // Save abandoned cart when user leaves with items
  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (state.items.length > 0 && !state.isLoading) {
        try {
          const sessionId = getSessionId()
          await fetch('/api/cart/abandoned', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartData: state.items,
              sessionId: session ? null : sessionId,
              email: session?.user?.email
            })
          })
        } catch (error) {
          console.error('Error saving abandoned cart:', error)
        }
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [state.items, state.isLoading, session])

  // Save to localStorage whenever cart changes
  useEffect(() => {
    if (!state.isLoading) {
      localStorage.setItem('ekaashi-cart', JSON.stringify(state.items))
    }
  }, [state.items, state.isLoading])

  const addItem = async (item: Omit<CartItem, 'quantity'>, qty: number = 1) => {
    // Optimistic update
    for (let i = 0; i < qty; i++) {
      dispatch({ type: 'ADD_ITEM', payload: item })
    }
    
    try {
      const sessionId = getSessionId()
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          quantity: qty,
          sessionId: session ? null : sessionId
        })
      })
      
      if (!response.ok) {
        // Revert optimistic update on error
        for (let i = 0; i < qty; i++) {
          dispatch({ type: 'REMOVE_ITEM', payload: item.id })
        }
        throw new Error('Failed to add item to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const removeItem = async (id: string) => {
    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    
    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/cart?productId=${id}&sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        // Revert would be complex here, so we'll just sync
        await syncCart()
        throw new Error('Failed to remove item from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      throw error
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    // Optimistic update
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    
    try {
      const sessionId = getSessionId()
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: id,
          quantity,
          sessionId: session ? null : sessionId
        })
      })
      
      if (!response.ok) {
        // Revert would be complex here, so we'll just sync
        await syncCart()
        throw new Error('Failed to update cart')
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      throw error
    }
  }

  const clearCart = async () => {
    // Optimistic update
    dispatch({ type: 'CLEAR_CART' })
    
    try {
      const sessionId = getSessionId()
      const response = await fetch(`/api/cart?clearAll=true&sessionId=${sessionId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        // Revert would be complex here, so we'll just sync
        await syncCart()
        throw new Error('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      throw error
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}