import { serverFetch } from '@/lib/server-api'
import type {
  CategoriesResponse,
  Category,
  Product,
  ProductFilters,
  ProductsResponse,
  RelatedProductsResponse,
} from '@/types'

/**
 * Server-side counterpart of the products API. Return types mirror the real
 * backend responses (see apps/backend/src/modules/products).
 */
export const productsServerService = {
  getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    return serverFetch<ProductsResponse>('/products', { ...filters })
  },

  // Next memoizes identical GET fetches within a request, so generateMetadata
  // and the page body share a single call.
  getProductById(id: string): Promise<Product> {
    return serverFetch<Product>(`/products/${id}`)
  },

  getRelatedProducts(id: string, limit = 3): Promise<RelatedProductsResponse> {
    return serverFetch<RelatedProductsResponse>(`/products/${id}/related`, { limit })
  },

  async getCategories(): Promise<Category[]> {
    // 250 is the API-wide maximum page size; there are far fewer categories.
    const page = await serverFetch<CategoriesResponse>('/categories', { limit: 250 })
    return page.items
  },
}
