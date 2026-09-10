'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { useProductById, useRelatedProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/format'

const FREE_SHIPPING_THRESHOLD = 300
const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%2394a3b8"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'

type AddState = 'idle' | 'adding' | 'added' | 'error'

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addItem } = useCart()

  const productId = params.id
  const { data: product, isLoading, isError } = useProductById(productId)
  const { data: related } = useRelatedProducts(productId, 3)

  const [quantity, setQuantity] = useState(1)
  const [addState, setAddState] = useState<AddState>('idle')

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-slate-200 rounded-lg aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
            <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-24 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
        <Link href="/products" className="text-slate-900 font-semibold hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  const inStock = product.stock > 0
  const maxQuantity = Math.max(1, product.stock)
  const relatedProducts = related?.items ?? []

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`)
      return
    }

    try {
      setAddState('adding')
      await addItem(product.id, quantity)
      setAddState('added')
    } catch {
      setAddState('error')
    } finally {
      setTimeout(() => setAddState('idle'), 2000)
    }
  }

  const buttonLabel: Record<AddState, string> = {
    idle: inStock ? 'Add to Cart' : 'Out of Stock',
    adding: 'Adding...',
    added: '✓ Added to cart',
    error: 'Could not add. Try again',
  }

  return (
    <div className="container mx-auto px-4">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-slate-600">
        <Link href="/" className="hover:text-slate-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-slate-900">
          Products
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <span className="text-slate-600">{product.category.name}</span>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden aspect-square">
          <img
            src={product.imageUrl ?? PLACEHOLDER_IMAGE}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE
            }}
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {/* Category */}
          <p className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
            {product.category?.name ?? 'Uncategorized'}
          </p>

          {/* Name */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>

          {/* Price */}
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
            <p className="text-sm text-slate-600 mt-2">
              Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-700 mb-8 leading-relaxed">{product.description}</p>
          )}

          {/* Stock Status */}
          {inStock ? (
            <p className="mb-6 text-sm text-green-700">
              {product.stock <= 5 ? `Only ${product.stock} left in stock` : 'In stock'}
            </p>
          ) : (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Currently out of stock</p>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
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
                onChange={(e) => {
                  const next = Number.parseInt(e.target.value, 10)
                  setQuantity(Number.isNaN(next) ? 1 : Math.min(maxQuantity, Math.max(1, next)))
                }}
                disabled={!inStock}
                className="w-16 text-center py-2 outline-none"
                aria-label="Quantity"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={!inStock || quantity >= maxQuantity}
                className="px-4 py-2 hover:bg-slate-100 disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock || addState === 'adding'}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                addState === 'added'
                  ? 'bg-green-600 text-white'
                  : addState === 'error'
                    ? 'bg-red-600 text-white'
                    : inStock
                      ? 'bg-slate-900 text-white hover:bg-slate-800'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {buttonLabel[addState]}
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Related Products</h2>
            <Link href="/products" className="text-slate-900 font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
