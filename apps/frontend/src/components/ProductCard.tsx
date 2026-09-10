'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { formatCurrency } from '@/lib/format'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2394a3b8"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'

type AddState = 'idle' | 'adding' | 'added' | 'error'

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()
  const [addState, setAddState] = useState<AddState>('idle')

  const inStock = product.stock > 0

  const handleAddToCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // The whole card is a link to the product page.
    event.preventDefault()
    event.stopPropagation()

    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`)
      return
    }

    try {
      setAddState('adding')
      await addItem(product.id, 1)
      setAddState('added')
    } catch {
      setAddState('error')
    } finally {
      setTimeout(() => setAddState('idle'), 2000)
    }
  }

  const buttonLabel: Record<AddState, string> = {
    idle: inStock ? 'Add to Cart' : 'Unavailable',
    adding: 'Adding...',
    added: '✓ Added',
    error: 'Try again',
  }

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
          <img
            src={product.imageUrl ?? PLACEHOLDER_IMAGE}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {/* Category */}
          <p className="text-xs text-slate-500 font-medium mb-1">
            {product.category?.name ?? 'Uncategorized'}
          </p>

          {/* Name */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">{product.name}</h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{product.description}</p>

          {/* Price */}
          <div className="flex items-center justify-between mb-3 mt-auto">
            <div className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</div>
            {inStock ? (
              product.stock <= 5 && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">
                  Only {product.stock} left
                </span>
              )
            ) : (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!inStock || addState === 'adding'}
            className={`w-full py-2 px-3 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              addState === 'added'
                ? 'bg-green-600 text-white'
                : addState === 'error'
                  ? 'bg-red-600 text-white'
                  : inStock
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-500'
            }`}
          >
            {buttonLabel[addState]}
          </button>
        </div>
      </div>
    </Link>
  )
}
