'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations'
import { FormInput } from '@/components/FormInput'
import { ErrorAlert } from '@/components/ErrorAlert'
import apiClient from '@/lib/api-client'

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setApiError(null)
    setIsLoading(true)

    try {
      await apiClient.post('/auth/forgot-password', { email: data.email })
      setIsSubmitted(true)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email'
      setApiError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
          <p className="text-slate-600 mb-6">
            We've sent password reset instructions to the email address you provided.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Check your inbox and follow the link to reset your password. The link expires in 1 hour.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h1>
      <p className="text-slate-600 mb-8">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <ErrorAlert message={apiError} onDismiss={() => setApiError(null)} />

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Email"
          id="email"
          type="email"
          placeholder="your@email.com"
          error={form.formState.errors.email}
          {...form.register('email')}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-600">
        Remember your password?{' '}
        <Link href="/auth/login" className="text-slate-900 font-semibold hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  )
}
