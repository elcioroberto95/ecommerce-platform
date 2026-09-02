'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLogin } from '@/hooks/useLogin'
import { FormInput } from '@/components/FormInput'
import { ErrorAlert } from '@/components/ErrorAlert'

export default function LoginPage() {
  const router = useRouter()
  const { form, onSubmit, isLoading, apiError } = useLogin()
  const [showPassword, setShowPassword] = useState(false)

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await onSubmit(e)
    if (!form.formState.errors.root?.message && !apiError) {
      router.push('/')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Login</h1>
      <p className="text-slate-600 mb-8">Sign in to your account to continue</p>

      <ErrorAlert message={apiError} onDismiss={() => form.clearErrors('root')} />

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="your@email.com"
          error={form.formState.errors.email}
          {...form.register('email')}
        />

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              {...form.register('password')}
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="••••••••"
              className={`
                w-full px-4 py-2 border rounded-lg pr-12
                focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
                transition disabled:opacity-50
                ${form.formState.errors.password ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 border-slate-300 rounded cursor-pointer"
            />
            <span className="text-slate-600">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-slate-900 hover:underline font-medium">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-600">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-slate-900 font-semibold hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}
