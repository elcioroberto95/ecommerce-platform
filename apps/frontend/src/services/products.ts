import apiClient from '@/lib/api-client'
import type {
  CategoriesResponse,
  Category,
  Product,
  ProductFilters,
  ProductsResponse,
  RelatedProductsResponse,
} from '@/types'

/**
 * Thin wrappers over the backend products API. Every return type mirrors the
 * real response shape (see apps/backend/src/modules/products).
 */
export const productsService = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await apiClient.get<ProductsResponse>('/products', { params: filters })
    return response.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async getRelatedProducts(id: string, limit = 3): Promise<RelatedProductsResponse> {
    const response = await apiClient.get<RelatedProductsResponse>(`/products/${id}/related`, {
      params: { limit },
    })
    return response.data
  },

  async getCategories(): Promise<Category[]> {
    // 250 is the API-wide maximum page size; there are far fewer categories.
    const response = await apiClient.get<CategoriesResponse>('/categories', { params: { limit: 250 } })
    return response.data.items
  },
}
