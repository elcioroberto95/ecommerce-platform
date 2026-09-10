'use client'

import { useAddToCart, type AddToCartState } from '@/hooks/useAddToCart'

interface AddToCartButtonProps {
  productId: string
  inStock: boolean
}

const LABELS: Record<AddToCartState, string> = {
  idle: 'Add to Cart',
  adding: 'Adding...',
  added: '✓ Added',
  error: 'Try again',
}

export function AddToCartButton({ productId, inStock }: AddToCartButtonProps) {
  const { state, add } = useAddToCart(productId)

  return (
    <button
      type="button"
      onClick={(event) => {
        // The whole card is a link to the product page.
        event.preventDefault()
        event.stopPropagation()
        void add(1)
      }}
      disabled={!inStock || state === 'adding'}
      className={`w-full py-2 px-3 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        state === 'added'
          ? 'bg-green-600 text-white'
          : state === 'error'
            ? 'bg-red-600 text-white'
            : inStock
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-slate-200 text-slate-500'
      }`}
    >
      {inStock ? LABELS[state] : 'Unavailable'}
    </button>
  )
}
