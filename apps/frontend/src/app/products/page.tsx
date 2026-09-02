'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    minPrice: 0,
    maxPrice: 1000,
    inStockOnly: false,
    sortBy: 'featured',
  })

  useEffect(() => {
    // Mock products - in production, fetch from API
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Wireless Headphones',
        description: 'Premium wireless headphones with noise cancellation',
        price: 199.99,
        image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        category_id: 'electronics',
        in_stock: true,
        rating: 4.5,
        reviews_count: 128,
      },
      {
        id: '2',
        name: 'Smart Watch',
        description: 'Advanced fitness tracking smartwatch',
        price: 299.99,
        image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        category_id: 'electronics',
        in_stock: true,
        rating: 4.8,
        reviews_count: 256,
      },
      {
        id: '3',
        name: 'Backpack Pro',
        description: 'Durable laptop backpack with multiple compartments',
        price: 89.99,
        image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
        category_id: 'accessories',
        in_stock: true,
        rating: 4.6,
        reviews_count: 89,
      },
      {
        id: '4',
        name: 'USB-C Hub',
        description: '7-in-1 USB-C hub with multiple ports',
        price: 49.99,
        image_url: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
        category_id: 'electronics',
        in_stock: true,
        rating: 4.4,
        reviews_count: 67,
      },
      {
        id: '5',
        name: 'Desk Lamp',
        description: 'LED desk lamp with adjustable brightness',
        price: 59.99,
        image_url: 'https://images.unsplash.com/photo-1565636192335-14c46e7f6c67?w=500&h=500&fit=crop',
        category_id: 'home',
        in_stock: true,
        rating: 4.7,
        reviews_count: 145,
      },
      {
        id: '6',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard with hot-swap switches',
        price: 149.99,
        image_url: 'https://images.unsplash.com/photo-1587829191301-72e332e2ad07?w=500&h=500&fit=crop',
        category_id: 'electronics',
        in_stock: false,
        rating: 4.9,
        reviews_count: 312,
      },
    ]

    setTimeout(() => {
      setProducts(mockProducts)
      setIsLoading(false)
    }, 300)
  }, [])

  // Apply filters
  useEffect(() => {
    let result = [...products]

    // Search filter
    if (filters.search) {
      const search = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search)
      )
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter((p) => p.category_id === filters.category)
    }

    // Price filter
    result = result.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice)

    // Stock filter
    if (filters.inStockOnly) {
      result = result.filter((p) => p.in_stock)
    }

    // Sorting
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(result)
  }, [products, filters])

  const categories = ['all', 'electronics', 'accessories', 'home']

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
              <label className="block text-sm font-semibold text-slate-900 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Category</label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={filters.category === cat}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-700 capitalize">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">Price Range</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-slate-600">
                  <span>${filters.minPrice}</span>
                  <span>${filters.maxPrice}</span>
                </div>
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
              <label className="block text-sm font-semibold text-slate-900 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              onClick={() =>
                setFilters({
                  search: '',
                  category: 'all',
                  minPrice: 0,
                  maxPrice: 1000,
                  inStockOnly: false,
                  sortBy: 'featured',
                })
              }
              className="w-full py-2 px-3 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Main Content - Products */}
        <div className="lg:col-span-3">
          {/* Results Count */}
          <div className="mb-6 text-sm text-slate-600">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-lg h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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
                onClick={() =>
                  setFilters({
                    search: '',
                    category: 'all',
                    minPrice: 0,
                    maxPrice: 1000,
                    inStockOnly: false,
                    sortBy: 'featured',
                  })
                }
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
