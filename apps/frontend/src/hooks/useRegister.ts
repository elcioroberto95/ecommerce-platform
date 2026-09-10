import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'

export function useRegister() {
  const { register: authRegister, isLoading: isAuthLoading } = useAuth()
  const [apiError, setApiError] = useState<string | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null)
    try {
      await authRegister(data.name, data.email, data.password)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to register'
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
