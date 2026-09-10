'use client'

import Link from 'next/link'
import { useState } from 'react'

interface HeaderMobileNavProps {
  links: ReadonlyArray<{ href: string; label: string }>
}

export function HeaderMobileNav({ links }: HeaderMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle menu"
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

      {isOpen && (
        <nav className="md:hidden absolute left-0 right-0 top-16 bg-white border-t border-slate-200 px-4 py-4 space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block text-slate-700 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </>
  )
}
