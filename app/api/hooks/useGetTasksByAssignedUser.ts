import { useQuery } from '@tanstack/react-query'
import { getTasksByAssignedUser, Task } from '../functions/tasks'

export interface UseGetTasksByAssignedUserOptions {
  userId: string
  enabled?: boolean
}

/**
 * Hook to fetch tasks assigned to a specific user
 * @param options - Query options including userId and enabled flag
 * @returns Query result with tasks data
 */
export function useGetTasksByAssignedUser(options: UseGetTasksByAssignedUserOptions) {
  const { userId, enabled = true } = options

  const { data, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks', 'assigned', userId],
    queryFn: async () => {
      const response = await getTasksByAssignedUser(userId)
      if (response.success && response.data) {
        return response.data as Task[]
      }
      throw new Error(response.error?.toString() || 'Failed to fetch assigned tasks')
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  const incompleteTasks = data?.filter(task => task.status !== 'completed') || []

  return {
    tasks: data || [],
    incompleteTasks,
    isLoading,
    error,
  }
}
