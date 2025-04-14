import { useQuery } from '@tanstack/react-query'
import { getTasksByCreator, Task } from '../functions/tasks'

export interface UseGetTasksByCreatorOptions {
  userId: string
  enabled?: boolean
}

/**
 * Hook to fetch tasks created by a specific user
 * @param options - Query options including userId and enabled flag
 * @returns Query result with tasks data
 */
export function useGetTasksByCreator(options: UseGetTasksByCreatorOptions) {
  const { userId, enabled = true } = options

  const { data, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks', 'created', userId],
    queryFn: async () => {
      const response = await getTasksByCreator(userId)
      if (response.success && response.data) {
        return response.data as Task[]
      }
      throw new Error(response.error?.toString() || 'Failed to fetch created tasks')
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    tasks: data || [],
    isLoading,
    error,
  }
}
