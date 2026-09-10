import type { ProductFilters, ProductSort } from '@/types'

export const PAGE_SIZE = 12
export const MAX_PRICE = 16000

export const SORT_OPTIONS: ReadonlyArray<{ value: ProductSort; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

/** The catalog filters, as they live in the URL. */
export interface ProductSearch {
  search: string
  category: string // '' = all
  maxPrice: number
  inStockOnly: boolean
  sort: ProductSort
  page: number
}

export const DEFAULT_SEARCH: ProductSearch = {
  search: '',
  category: '',
  maxPrice: MAX_PRICE,
  inStockOnly: false,
  sort: 'relevance',
  page: 1,
}

export type RawSearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? ''
}

function parseNumber(value: string, fallback: number, min: number, max: number): number {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : fallback
}

/** Query string is user input: everything is validated back into a known shape. */
export function parseProductSearch(params: RawSearchParams): ProductSearch {
  const sort = firstValue(params.sort)

  return {
    search: firstValue(params.search).trim(),
    category: firstValue(params.category),
    maxPrice: parseNumber(firstValue(params.maxPrice), MAX_PRICE, 0, MAX_PRICE),
    inStockOnly: firstValue(params.inStock) === 'true',
    sort: SORT_OPTIONS.some((option) => option.value === sort)
      ? (sort as ProductSort)
      : DEFAULT_SEARCH.sort,
    page: parseNumber(firstValue(params.page), 1, 1, Number.MAX_SAFE_INTEGER),
  }
}

export function toProductFilters(search: ProductSearch): ProductFilters {
  return {
    page: search.page,
    limit: PAGE_SIZE,
    search: search.search || undefined,
    category: search.category || undefined,
    priceMax: search.maxPrice < MAX_PRICE ? search.maxPrice : undefined,
    inStock: search.inStockOnly || undefined,
    sort: search.sort,
  }
}

/** Builds `/products?...`, omitting defaults so the URL stays readable. */
export function buildProductsHref(search: ProductSearch): string {
  const params = new URLSearchParams()

  if (search.search) params.set('search', search.search)
  if (search.category) params.set('category', search.category)
  if (search.maxPrice < MAX_PRICE) params.set('maxPrice', String(search.maxPrice))
  if (search.inStockOnly) params.set('inStock', 'true')
  if (search.sort !== DEFAULT_SEARCH.sort) params.set('sort', search.sort)
  if (search.page > 1) params.set('page', String(search.page))

  const query = params.toString()
  return query ? `/products?${query}` : '/products'
}
