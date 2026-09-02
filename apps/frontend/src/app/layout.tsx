import type { Metadata } from 'next'
import { AuthProvider } from '@/context/AuthContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'E-Shop - Modern E-commerce Platform',
  description: 'Modern e-commerce platform with focus on architecture and scalability',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-1 py-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
