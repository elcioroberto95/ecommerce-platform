import Link from 'next/link'
import type { ReactNode } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import {
  buildProductsHref,
  PAGE_SIZE,
  parseProductSearch,
  toProductFilters,
  type RawSearchParams,
} from '@/lib/product-search'
import { productsServerService } from '@/services/products.server'
import type { Category, ProductsResponse } from '@/types'

export const metadata = {
  title: 'Products | E-Shop',
  description: 'Browse our full collection of products',
}

interface ProductsPageProps {
  searchParams: RawSearchParams
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const search = parseProductSearch(searchParams)

  const [page, categories] = await Promise.all([
    productsServerService.getProducts(toProductFilters(search)).catch((): null => null),
    productsServerService.getCategories().catch((): Category[] => []),
  ])

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
        <p className="text-slate-600">Browse our full collection of products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <ProductFilters categories={categories} />
        </div>

        {/* Main Content - Products */}
        <div className="lg:col-span-3">
          <ProductGrid page={page} search={search} />
        </div>
      </div>
    </div>
  )
}

function ProductGrid({
  page,
  search,
}: {
  page: ProductsResponse | null
  search: ReturnType<typeof parseProductSearch>
}) {
  if (!page) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-700 font-medium">We couldn&apos;t load the products.</p>
        <p className="text-sm text-red-600 mt-1">Please try again in a moment.</p>
      </div>
    )
  }

  if (page.items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-slate-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
        <p className="text-slate-600 mb-4">Try adjusting your filters</p>
        <Link href="/products" className="px-6 py-2 text-slate-900 font-medium hover:underline">
          Clear filters
        </Link>
      </div>
    )
  }

  const { meta } = page
  const firstItem = (meta.page - 1) * PAGE_SIZE + 1
  const lastItem = firstItem + page.items.length - 1

  return (
    <>
      <div className="mb-6 text-sm text-slate-600">
        Showing {firstItem.toLocaleString('pt-BR')}-{lastItem.toLocaleString('pt-BR')} of{' '}
        {meta.total.toLocaleString('pt-BR')} product{meta.total !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {page.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {meta.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <PaginationLink
            href={buildProductsHref({ ...search, page: meta.page - 1 })}
            disabled={meta.page <= 1}
          >
            ← Previous
          </PaginationLink>
          <span className="text-sm text-slate-600">
            Page {meta.page.toLocaleString('pt-BR')} of {meta.totalPages.toLocaleString('pt-BR')}
          </span>
          <PaginationLink
            href={buildProductsHref({ ...search, page: meta.page + 1 })}
            disabled={meta.page >= meta.totalPages}
          >
            Next →
          </PaginationLink>
        </div>
      )}
    </>
  )
}

function PaginationLink({
  href,
  disabled,
  children,
}: {
  href: string
  disabled: boolean
  children: ReactNode
}) {
  const className = 'px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg'

  if (disabled) {
    return <span className={`${className} opacity-50 cursor-not-allowed`}>{children}</span>
  }

  return (
    <Link href={href} scroll={false} className={`${className} hover:bg-slate-50`}>
      {children}
    </Link>
  )
}
