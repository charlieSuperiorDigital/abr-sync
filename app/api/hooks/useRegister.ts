import { useMutation } from '@tanstack/react-query'
import { register } from '@/app/api/functions/authentication'

import { RegisterCredentials } from '../functions/authentication'

import { RegisterResponse } from '../functions/authentication'

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
