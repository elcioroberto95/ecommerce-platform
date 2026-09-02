'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ProductCard } from '@/components/ProductCard'
import { Product } from '@/types'

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Mock featured products - in production, fetch from API
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

    // Simulate loading
    setTimeout(() => {
      setFeaturedProducts(mockProducts)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-12 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to E-Shop</h1>
          <p className="text-xl md:text-2xl mb-8 text-slate-200">
            Discover amazing products at unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-3 bg-white text-slate-900 rounded-lg font-semibold hover:bg-slate-100 transition"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-slate-900 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Products</h2>
            <p className="text-slate-600">Handpicked items just for you</p>
          </div>
          <Link
            href="/products"
            className="text-slate-900 font-semibold hover:underline hidden md:block"
          >
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-200 rounded-lg h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            View all products
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 rounded-2xl p-12 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">10K+</div>
            <p className="text-slate-600">Products in stock</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">50K+</div>
            <p className="text-slate-600">Happy customers</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-slate-900 mb-2">24/7</div>
            <p className="text-slate-600">Customer support</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-lg mb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">New to E-Shop?</h3>
            <p className="text-slate-600">
              Sign up now and get 20% off your first purchase!
            </p>
          </div>
          <Link
            href="/auth/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition whitespace-nowrap"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
