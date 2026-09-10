import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'

export function useLogin() {
  const { login: authLogin, isLoading: isAuthLoading } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null)
    try {
      await authLogin(data.email, data.password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login'
      setApiError(message)
      form.setError('root', { message })
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isAuthLoading,
    apiError,
  }
}
