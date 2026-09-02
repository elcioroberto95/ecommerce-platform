'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useRegister } from '@/hooks/useRegister'
import { FormInput } from '@/components/FormInput'
import { ErrorAlert } from '@/components/ErrorAlert'

function PasswordStrengthIndicator({ password }: { password: string }) {
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isLongEnough = password.length >= 8

  const strength = [hasUppercase, hasNumber, isLongEnough].filter(Boolean).length

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i < strength ? 'bg-green-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <ul className="text-xs text-slate-600 space-y-1">
        <li className={hasUppercase ? 'text-green-600' : ''}>
          {hasUppercase ? '✓' : '○'} At least one uppercase letter
        </li>
        <li className={hasNumber ? 'text-green-600' : ''}>
          {hasNumber ? '✓' : '○'} At least one number
        </li>
        <li className={isLongEnough ? 'text-green-600' : ''}>
          {isLongEnough ? '✓' : '○'} At least 8 characters
        </li>
      </ul>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const { form, onSubmit, isLoading, apiError } = useRegister()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordValue = form.watch('password')

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(e)
    if (!form.formState.errors.root?.message && !apiError) {
      router.push('/')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
      <p className="text-slate-600 mb-8">Join our e-commerce platform today</p>

      <ErrorAlert message={apiError} onDismiss={() => form.clearErrors('root')} />

      <form onSubmit={handleFormSubmit} className="space-y-6">
        <FormInput
          label="Full Name"
          id="name"
          type="text"
          placeholder="John Doe"
          error={form.formState.errors.name}
          {...form.register('name')}
        />

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
          {passwordValue && <PasswordStrengthIndicator password={passwordValue} />}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirm Password <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              {...form.register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              placeholder="••••••••"
              className={`
                w-full px-4 py-2 border rounded-lg pr-12
                focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent
                transition disabled:opacity-50
                ${form.formState.errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-slate-300'}
              `}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-600">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <label className="flex items-start gap-2">
          <input type="checkbox" className="w-4 h-4 border-slate-300 rounded mt-1" required />
          <span className="text-sm text-slate-600">
            I agree to the{' '}
            <Link href="/terms" className="font-medium text-slate-900 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="font-medium text-slate-900 hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-600">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-slate-900 font-semibold hover:underline">
          Sign in here
        </Link>
      </p>
    </div>
  )
}
