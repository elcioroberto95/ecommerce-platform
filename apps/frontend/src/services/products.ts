import apiClient from '@/lib/api-client'
import { Product } from '@/types'

interface ProductsResponse {
  data: Product[]
  pagination: {
    total: number
    page: number
    limit: number
    total_pages: number
  }
}

interface ProductFilters {
  page?: number
  limit?: number
  category_id?: string
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popularity'
  min_price?: number
  max_price?: number
}

export const productsService = {
  async getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
    const response = await apiClient.get('/products', { params: filters })
    return response.data
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`)
    return response.data
  },

  async searchProducts(query: string, limit = 10) {
    const response = await apiClient.get('/products/search', {
      params: { q: query, limit },
    })
    return response.data
  },

  async getCategories() {
    const response = await apiClient.get('/categories')
    return response.data
  },

  async getRelatedProducts(categoryId: string, limit = 3) {
    const response = await apiClient.get('/products', {
      params: { category_id: categoryId, limit },
    })
    return response.data.data
  },
}
