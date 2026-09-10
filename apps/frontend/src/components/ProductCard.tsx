import Link from 'next/link'
import { AddToCartButton } from '@/components/AddToCartButton'
import { ProductImage } from '@/components/ProductImage'
import { formatCurrency } from '@/lib/format'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

/** Server component: only the image fallback and the button ship JavaScript. */
export function ProductCard({ product }: ProductCardProps) {
  const inStock = product.stock > 0

  return (
    <Link href={`/products/${product.id}`}>
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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

          <AddToCartButton productId={product.id} inStock={inStock} />
        </div>
      </div>
    </Link>
  )
}
