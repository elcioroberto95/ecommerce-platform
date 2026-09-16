'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import { formatCurrency } from '@/lib/format'
import {
  buildProductsHref,
  MAX_PRICE,
  parseProductSearch,
  SORT_OPTIONS,
  type ProductSearch,
} from '@/lib/product-search'
import type { Category, ProductSort } from '@/types'

const DEBOUNCE_MS = 300

interface ProductFiltersProps {
  categories: Category[]
}

/**
 * The URL is the single source of truth: every change rewrites the query string
 * and the server re-renders the grid. Only the text box and the price slider
 * keep a local draft, so typing/dragging doesn't fire one request per keystroke.
 */
export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = parseProductSearch(Object.fromEntries(searchParams.entries()))

  const [draftSearch, setDraftSearch] = useState(current.search)
  const [draftMaxPrice, setDraftMaxPrice] = useState(current.maxPrice)
  const [isPending, startTransition] = useTransition()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep the drafts in sync when the URL changes elsewhere (reset, back button).
  useEffect(() => {
    setDraftSearch(current.search)
    setDraftMaxPrice(current.maxPrice)
  }, [current.search, current.maxPrice])

  useEffect(() => () => clearTimeout(debounceRef.current ?? undefined), [])

  // Any filter change sends the user back to page 1.
  const navigate = (patch: Partial<ProductSearch>) => {
    const next: ProductSearch = { ...current, page: 1, ...patch }
    startTransition(() => router.replace(buildProductsHref(next), { scroll: false }))
  }

  const navigateDebounced = (patch: Partial<ProductSearch>) => {
    clearTimeout(debounceRef.current ?? undefined)
    debounceRef.current = setTimeout(() => navigate(patch), DEBOUNCE_MS)
  }

  const onSearchChange = (value: string) => {
    setDraftSearch(value)
    navigateDebounced({ search: value.trim(), maxPrice: draftMaxPrice })
  }

  const onMaxPriceChange = (value: number) => {
    setDraftMaxPrice(value)
    navigateDebounced({ search: draftSearch.trim(), maxPrice: value })
  }

  const resetFilters = () => {
    clearTimeout(debounceRef.current ?? undefined)
    startTransition(() => router.replace('/products', { scroll: false }))
  }

  return (
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
          value={draftSearch}
          onChange={(event) => onSearchChange(event.target.value)}
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
              checked={current.category === ''}
              onChange={() => navigate({ category: '' })}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-700">All</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={current.category === category.id}
                onChange={() => navigate({ category: category.id })}
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
          value={draftMaxPrice}
          onChange={(event) => onMaxPriceChange(Number(event.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-600 mt-1">
          <span>{formatCurrency(0)}</span>
          <span>{draftMaxPrice >= MAX_PRICE ? 'No limit' : formatCurrency(draftMaxPrice)}</span>
        </div>
      </div>

      {/* In Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={current.inStockOnly}
            onChange={(event) => navigate({ inStockOnly: event.target.checked })}
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
          value={current.sort}
          onChange={(event) => navigate({ sort: event.target.value as ProductSort })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full py-2 px-3 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
      >
        Reset Filters
      </button>

      <p className={`text-sm text-slate-400 text-center ${isPending ? 'visible' : 'invisible'}`}>
        Updating...
      </p>
    </div>
  )
}
