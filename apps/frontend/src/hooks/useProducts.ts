import { useQuery } from '@tanstack/react-query'
import { productsService } from '@/services/products'
import type { ProductFilters } from '@/types'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previous) => previous, // keep the grid while a new page/filter loads
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

export function useRelatedProducts(id: string, limit = 3) {
  return useQuery({
    queryKey: ['product-related', id, limit],
    queryFn: () => productsService.getRelatedProducts(id, limit),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  })
}
