'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'

export type AddToCartState = 'idle' | 'adding' | 'added' | 'error'

const RESET_DELAY_MS = 2000

/**
 * Add-to-cart is authenticated, so it stays on the client: the JWT lives in
 * localStorage and never reaches the server renderer.
 */
export function useAddToCart(productId: string) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [state, setState] = useState<AddToCartState>('idle')

  const add = async (quantity: number): Promise<void> => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${productId}`)}`)
      return
    }

    try {
      setState('adding')
      await addItem(productId, quantity)
      setState('added')
    } catch {
      setState('error')
    } finally {
      setTimeout(() => setState('idle'), RESET_DELAY_MS)
    }
  }

  return { state, add }
}
