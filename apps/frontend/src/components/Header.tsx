import Link from 'next/link'
import { CartBadge } from '@/components/CartBadge'
import { HeaderMobileNav } from '@/components/HeaderMobileNav'
import { HeaderUserMenu } from '@/components/HeaderUserMenu'

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const

/**
 * Server component. Only the pieces that depend on session state (cart count,
 * user menu) or on toggling (mobile nav) are client islands.
 */
export function Header() {
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
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-700 hover:text-slate-900 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* A plain GET form: no JavaScript, lands on the server-rendered listing. */}
            <form
              action="/products"
              className="hidden lg:flex items-center bg-slate-100 rounded-lg px-4 py-2 flex-1 max-w-xs"
            >
              <input
                type="search"
                name="search"
                placeholder="Search products..."
                aria-label="Search products"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button type="submit" aria-label="Search">
                <svg
                  className="w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 text-slate-700 hover:text-slate-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <CartBadge />
            </Link>

            <HeaderUserMenu />

            <HeaderMobileNav links={NAV_LINKS} />
          </div>
        </div>
      </div>
    </header>
  )
}
