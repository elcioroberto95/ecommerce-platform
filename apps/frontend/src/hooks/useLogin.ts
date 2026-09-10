import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormData } from '@/lib/validations'
import { useAuth } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/api-client'

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

  /**
   * Resolves true only when the credentials were accepted. The caller cannot
   * read `apiError` right after awaiting: it still holds the previous render's
   * value, which used to redirect the user away from a failed login.
   */
  const onSubmit = async (event: React.FormEvent): Promise<boolean> => {
    let succeeded = false

    await form.handleSubmit(async (data) => {
      setApiError(null)
      try {
        await authLogin(data.email, data.password)
        succeeded = true
      } catch (error) {
        const message = getApiErrorMessage(error, 'Failed to login')
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
