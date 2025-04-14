import { useMutation } from '@tanstack/react-query'
import { register } from '@/app/api/functions/authentication'

interface RegisterCredentials {
  tenantId: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  ssoToken: string
}

interface RegisterResponse {
  userId: string
  token: string
  email: string
  firstName: string
  lastName: string
  roles: string[]
  errorMessage: string
  tokenExpiration: string
}

export const useRegister = () => {
  const mutation = useMutation<RegisterResponse, unknown, RegisterCredentials>({
    mutationFn: async (credentials) => {
      const response = await register(credentials)
      if (!response) {
        throw new Error('Registration failed')
      }
      return response
    },
    
    retry: 1, // Only retry once
    onError: (error) => {
      console.error('Registration failed:', error)
    }
  })

  return {
    register: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
