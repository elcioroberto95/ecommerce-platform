import Link from 'next/link'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {/* Image */}
        <div className="aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/%3E%3C/svg%3E'
            }}
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-slate-500 font-medium mb-1">{product.category_id}</p>

          {/* Name */}
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2">{product.name}</h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 mb-3">{product.description}</p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-slate-600">{product.reviews_count} reviews</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</div>
            {!product.in_stock && (
              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault()
              // Handle add to cart
            }}
            disabled={!product.in_stock}
            className="w-full py-2 px-3 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: product.in_stock ? '#1e293b' : '#e2e8f0',
              color: product.in_stock ? '#ffffff' : '#64748b',
            }}
          >
            {product.in_stock ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </Link>
  )
}
