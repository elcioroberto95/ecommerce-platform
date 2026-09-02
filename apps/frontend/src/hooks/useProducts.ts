import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/products'

interface UseProductsOptions {
  page?: number
  limit?: number
  category_id?: string
  search?: string
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popularity'
  min_price?: number
  max_price?: number
}

export function useProducts(options?: UseProductsOptions) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => productsService.getProducts(options),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useProductSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: ['product-search', query, limit],
    queryFn: () => productsService.searchProducts(query, limit),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
