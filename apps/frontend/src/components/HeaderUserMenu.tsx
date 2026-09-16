'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'

export function HeaderUserMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/login"
        className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
      >
        Login
      </Link>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 text-slate-700 hover:text-slate-900"
      >
        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
          {user?.name.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Profile
          </Link>
          <Link
            href="/orders"
            onClick={() => setIsOpen(false)}
            className="block px-4 py-2 text-slate-700 hover:bg-slate-50"
          >
            Orders
          </Link>
          <button
            type="button"
            onClick={() => {
              logout()
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
