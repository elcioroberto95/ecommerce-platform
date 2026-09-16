'use client'

import { useCart } from '@/context/CartContext'

/** The cart is per-user and authenticated, so the count can only come from the client. */
export function CartBadge() {
  const { cart } = useCart()
  const count = cart?.item_count ?? 0

  if (count === 0) {
    return null
  }

  return (
    <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
      {count > 9 ? '9+' : count}
    </span>
  )
}
