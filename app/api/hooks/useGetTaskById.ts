import { useQuery } from '@tanstack/react-query'
import { getTaskById, Task } from '../functions/tasks'

export interface UseGetTaskByIdOptions {
  taskId: string
  enabled?: boolean
}

/**
 * Hook to fetch a single task by its ID
 * @param options - Query options including taskId and enabled flag
 * @returns Query result with task data
 */
export function useGetTaskById(options: UseGetTaskByIdOptions) {
  const { taskId, enabled = true } = options

  const { data, isLoading, error } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      const response = await getTaskById(taskId)
      if (response.success && response.data) {
        return response.data as Task
      }
      throw new Error(response.error?.toString() || 'Failed to fetch task')
    },
    enabled: enabled && !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    task: data,
    isLoading,
    error,
  }
}
