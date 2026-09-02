'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Welcome to E-commerce Platform
          </h1>
          <p className="text-xl text-slate-600 mb-12">
            A modern e-commerce platform built with Next.js, TypeScript, and Tailwind CSS
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/auth/login"
              className="inline-block px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="inline-block px-8 py-4 bg-white text-slate-900 border-2 border-slate-900 rounded-lg font-semibold hover:bg-slate-50 transition"
            >
              Register
            </Link>
          </div>

          <div className="mt-20 p-8 bg-white rounded-lg shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Implementation Status</h2>
            <div className="text-left space-y-3">
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-slate-700">Project setup complete</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-slate-700">API client configured</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-slate-700">Auth context ready</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                <span className="text-slate-700">Tailwind + TypeScript configured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
