'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'
import { useMemo } from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-1 py-8">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  )
}
