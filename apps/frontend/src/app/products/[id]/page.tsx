'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'

// Mock product data - in production, fetch from API
const MOCK_PRODUCTS: { [key: string]: Product & { longDescription: string; specifications: Record<string, string> } } = {
  '1': {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium wireless headphones with noise cancellation',
    longDescription:
      'Experience premium audio quality with our wireless headphones. Featuring active noise cancellation technology, 30-hour battery life, and premium comfort for all-day wear. Perfect for music, podcasts, or work calls.',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category_id: 'electronics',
    in_stock: true,
    rating: 4.5,
    reviews_count: 128,
    specifications: {
      'Battery Life': '30 hours',
      'Bluetooth Version': '5.0',
      'Noise Cancellation': 'Active',
      'Weight': '250g',
      'Warranty': '2 years',
    },
  },
  '2': {
    id: '2',
    name: 'Smart Watch',
    description: 'Advanced fitness tracking smartwatch',
    longDescription:
      'Stay connected and track your health with our advanced smartwatch. Monitor heart rate, sleep, workouts, and receive notifications all from your wrist. Water-resistant up to 50m.',
    price: 299.99,
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category_id: 'electronics',
    in_stock: true,
    rating: 4.8,
    reviews_count: 256,
    specifications: {
      'Display': 'AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5 ATM',
      'Sensors': 'HR, SpO2, Gyro',
    },
  },
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS[params.id]
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
        <Link href="/products" className="text-slate-900 font-semibold hover:underline">
          Back to products
        </Link>
      </div>
    )
  }

  const relatedProducts = Object.values(MOCK_PRODUCTS).filter(
    (p) => p.category_id === product.category_id && p.id !== product.id
  )

  const handleAddToCart = () => {
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
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
        <span>/</span>
        <span className="text-slate-900 font-medium">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden aspect-square">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col justify-center">
          {/* Category */}
          <p className="text-sm text-slate-500 font-medium mb-2 uppercase tracking-wide">
            {product.category_id}
          </p>

          {/* Name */}
          <h1 className="text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-slate-600">
              {product.rating} ({product.reviews_count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-4xl font-bold text-slate-900">${product.price.toFixed(2)}</p>
            <p className="text-sm text-slate-600 mt-2">Free shipping on orders over $50</p>
          </div>

          {/* Description */}
          <p className="text-slate-700 mb-8 leading-relaxed">{product.longDescription}</p>

          {/* Stock Status */}
          {!product.in_stock && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Currently out of stock</p>
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-slate-100"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center py-2 outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-slate-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : product.in_stock
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAdded ? '✓ Added to cart' : 'Add to Cart'}
            </button>
          </div>

          {/* Wishlist */}
          <button className="w-full py-3 px-6 border-2 border-slate-300 rounded-lg font-semibold text-slate-900 hover:bg-slate-50 transition">
            ♡ Add to Wishlist
          </button>
        </div>
      </div>

      {/* Specifications */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-lg p-8">
          {Object.entries(product.specifications).map(([key, value]) => (
            <div key={key} className="border-b border-slate-200 pb-4 last:border-0">
              <p className="text-sm text-slate-600 font-medium mb-1">{key}</p>
              <p className="text-slate-900 font-semibold">{value}</p>
            </div>
          ))}
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
            {relatedProducts.slice(0, 3).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
