import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateUser, UpdateUserRequest } from '@/app/api/functions/user'
import { User } from '@/app/types/user'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  const mutation = useMutation<User, unknown, { userId: string; data: UpdateUserRequest }>({
    mutationFn: async ({ userId, data }) => {
      const response = await updateUser(userId, data)
      if (!response) {
        throw new Error('Update failed')
      }
      return response
    },
    onSuccess: () => {
      // Invalidate users list queries to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    retry: 1,
    onError: (error) => {
      console.error('User update failed:', error)
    }
  })

  return {
    updateUser: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  }
}
