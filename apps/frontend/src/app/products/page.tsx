'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { useCategories, useProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/format'
import type { ProductSort } from '@/types'

const PAGE_SIZE = 12
const MAX_PRICE = 16000
const SEARCH_DEBOUNCE_MS = 300

interface Filters {
  search: string
  category: string // '' = all
  maxPrice: number
  inStockOnly: boolean
  sort: ProductSort
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: '',
  maxPrice: MAX_PRICE,
  inStockOnly: false,
  sort: 'relevance',
}

export default function ProductsPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)

  // Debounce the search box so we don't hit the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search.trim()), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [filters.search])

  // Any filter change resets pagination.
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, filters.category, filters.maxPrice, filters.inStockOnly, filters.sort])

  const { data: categories } = useCategories()

  const { data, isLoading, isError, isFetching } = useProducts({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
    category: filters.category || undefined,
    priceMax: filters.maxPrice < MAX_PRICE ? filters.maxPrice : undefined,
    inStock: filters.inStockOnly || undefined,
    sort: filters.sort,
  })

  const products = data?.items ?? []
  const meta = data?.meta
  const totalPages = meta?.totalPages ?? 1

  const resetFilters = () => setFilters(DEFAULT_FILTERS)

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Products</h1>
        <p className="text-slate-600">Browse our full collection of products</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-20 space-y-6">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-slate-900 mb-2">
                Search
              </label>
              <input
                id="search"
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Category */}
            <div>
              <span className="block text-sm font-semibold text-slate-900 mb-3">Category</span>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={() => setFilters({ ...filters, category: '' })}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-slate-700">All</span>
                </label>
                {(categories ?? []).map((category) => (
                  <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={filters.category === category.id}
                      onChange={() => setFilters({ ...filters, category: category.id })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-semibold text-slate-900 mb-3">
                Max Price
              </label>
              <input
                id="maxPrice"
                type="range"
                min={0}
                max={MAX_PRICE}
                step={50}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-slate-600 mt-1">
                <span>{formatCurrency(0)}</span>
                <span>{filters.maxPrice >= MAX_PRICE ? 'No limit' : formatCurrency(filters.maxPrice)}</span>
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStockOnly}
                  onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-slate-700">In Stock Only</span>
              </label>
            </div>

            {/* Sort */}
            <div>
              <label htmlFor="sort" className="block text-sm font-semibold text-slate-900 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value as ProductSort })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="relevance">Relevance</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              type="button"
              onClick={resetFilters}
              className="w-full py-2 px-3 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content - Products */}
        <div className="lg:col-span-3">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between text-sm text-slate-600">
            <span>
              {meta
                ? `Showing ${products.length} of ${meta.total.toLocaleString('pt-BR')} product${meta.total !== 1 ? 's' : ''}`
                : 'Loading products...'}
            </span>
            {isFetching && !isLoading && <span className="text-slate-400">Updating...</span>}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-700 font-medium">We couldn&apos;t load the products.</p>
              <p className="text-sm text-red-600 mt-1">Please try again in a moment.</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
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
              <button
                type="button"
                onClick={resetFilters}
                className="px-6 py-2 text-slate-900 font-medium hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
