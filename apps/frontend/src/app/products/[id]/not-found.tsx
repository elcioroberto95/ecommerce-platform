import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Product not found</h1>
      <Link href="/products" className="text-slate-900 font-semibold hover:underline">
        Back to products
      </Link>
    </div>
  )
}
