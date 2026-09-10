'use client'

import { useState } from 'react'
import { useAddToCart, type AddToCartState } from '@/hooks/useAddToCart'

interface AddToCartFormProps {
  productId: string
  stock: number
}

const LABELS: Record<AddToCartState, string> = {
  idle: 'Add to Cart',
  adding: 'Adding...',
  added: '✓ Added to cart',
  error: 'Could not add. Try again',
}

export function AddToCartForm({ productId, stock }: AddToCartFormProps) {
  const { state, add } = useAddToCart(productId)
  const [quantity, setQuantity] = useState(1)

  const inStock = stock > 0
  const maxQuantity = Math.max(1, stock)

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex items-center border border-slate-300 rounded-lg">
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          disabled={!inStock || quantity <= 1}
          className="px-4 py-2 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(event) => {
            const next = Number.parseInt(event.target.value, 10)
            setQuantity(Number.isNaN(next) ? 1 : Math.min(maxQuantity, Math.max(1, next)))
          }}
          disabled={!inStock}
          className="w-16 text-center py-2 outline-none"
          aria-label="Quantity"
        />
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
          disabled={!inStock || quantity >= maxQuantity}
          className="px-4 py-2 hover:bg-slate-100 disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => void add(quantity)}
        disabled={!inStock || state === 'adding'}
        className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
          state === 'added'
            ? 'bg-green-600 text-white'
            : state === 'error'
              ? 'bg-red-600 text-white'
              : inStock
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        {inStock ? LABELS[state] : 'Out of Stock'}
      </button>
    </div>
  )
}
