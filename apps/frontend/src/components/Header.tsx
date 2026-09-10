'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900">
            🛍️ E-Shop
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-slate-700 hover:text-slate-900 font-medium">
              Products
            </Link>
            <Link href="/about" className="text-slate-700 hover:text-slate-900 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-slate-700 hover:text-slate-900 font-medium">
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Search - Desktop only */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-xs">
              <input
                type="search"
                placeholder="Search products..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-slate-700 hover:text-slate-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
                >
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-slate-200 space-y-3">
            <Link href="/products" className="block text-slate-700 hover:text-slate-900">
              Products
            </Link>
            <Link href="/about" className="block text-slate-700 hover:text-slate-900">
              About
            </Link>
            <Link href="/contact" className="block text-slate-700 hover:text-slate-900">
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
