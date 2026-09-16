import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Shop',
  description: 'Discover amazing products at unbeatable prices',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Providers>
          <Header />
          <main className="flex-1 py-8">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
