import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/api-client'

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

  /** Resolves true only when the account was created and logged in. */
  const onSubmit = async (event: React.FormEvent): Promise<boolean> => {
    let succeeded = false

    await form.handleSubmit(async (data) => {
      setApiError(null)
      try {
        await authRegister(data.name, data.email, data.password)
        succeeded = true
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to register')
        setApiError(message)
        form.setError('root', { message })
      }
    })(event)

    return succeeded
  }

  return {
    form,
    onSubmit,
    isLoading: isAuthLoading,
    apiError,
  }
}
