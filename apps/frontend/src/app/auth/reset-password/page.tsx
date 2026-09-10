'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorAlert } from '@/components/ErrorAlert'
import apiClient, { getApiErrorMessage } from '@/lib/api-client'
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations'

// useSearchParams needs a Suspense boundary to keep the route prerenderable.
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    setApiError(null)
    setIsLoading(true)

    try {
      await apiClient.post('/auth/reset-password', { token, password: data.password })
      // The old session (if any) no longer matches the new password.
      router.push('/auth/login?reset=1')
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Could not reset your password'))
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invalid link</h1>
        <p className="text-slate-600 mb-8">
          This password reset link is incomplete. Request a new one to continue.
        </p>
        <Link
          href="/auth/forgot-password"
          className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
        >
          Request a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose a new password</h1>
      <p className="text-slate-600 mb-8">
        Your reset link is valid for one hour and can only be used once.
      </p>

      <ErrorAlert message={apiError} onDismiss={() => setApiError(null)} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            New password <span className="text-red-500 ml-1">*</span>
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
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirm new password <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            {...form.register('confirmPassword')}
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            placeholder="••••••••"
            className={`
              w-full px-4 py-2 border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
              transition disabled:opacity-50
              ${form.formState.errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}
            `}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save new password'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-600">
        Link expired?{' '}
        <Link href="/auth/forgot-password" className="text-slate-900 font-semibold hover:underline">
          Request a new one
        </Link>
      </p>
    </div>
  )
}
