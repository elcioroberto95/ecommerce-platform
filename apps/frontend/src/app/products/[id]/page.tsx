import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AddToCartForm } from '@/components/AddToCartForm'
import { ProductCard } from '@/components/ProductCard'
import { ProductImage } from '@/components/ProductImage'
import { formatCurrency } from '@/lib/format'
import { productsServerService } from '@/services/products.server'
import type { Product, RelatedProductsResponse } from '@/types'

const FREE_SHIPPING_THRESHOLD = 300

interface ProductDetailPageProps {
  params: { id: string }
}

async function findProduct(id: string): Promise<Product | null> {
  try {
    return await productsServerService.getProductById(id)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await findProduct(params.id)

  if (!product) {
    return { title: 'Product not found | E-Shop' }
  }

  return {
    title: `${product.name} | E-Shop`,
    description: product.description ?? undefined,
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, related] = await Promise.all([
    findProduct(params.id),
    productsServerService
      .getRelatedProducts(params.id, 3)
      .catch((): RelatedProductsResponse => ({ items: [], total: 0 })),
  ])

  if (!product) {
    notFound()
  }

  const inStock = product.stock > 0

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
            <Link
              href={`/products?category=${product.category.id}`}
              className="hover:text-slate-900"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-medium line-clamp-1">{product.name}</span>
      </div>

      {/* Product Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="flex items-center justify-center bg-slate-100 rounded-lg overflow-hidden aspect-square">
          <ProductImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            priority
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

          <AddToCartForm productId={product.id} stock={product.stock} />
        </div>
      </div>

      {/* Related Products */}
      {related.items.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Related Products</h2>
            <Link href="/products" className="text-slate-900 font-semibold hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.items.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
