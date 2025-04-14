import { useQuery } from '@tanstack/react-query'
import { getTasksByTenant, Task } from '../functions/tasks'

export interface UseGetTasksOptions {
  tenantId?: string
  enabled?: boolean
}

/**
 * Hook to fetch tasks for a specific tenant
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with tasks data
 */
export function useGetTasks(options: UseGetTasksOptions = {}) {
  const { tenantId, enabled = true } = options

  const { data, isLoading, error } = useQuery<Task[]>({
    queryKey: ['tasks', tenantId],
    queryFn: async () => {
      const response = await getTasksByTenant(tenantId)
      if (response.success && response.data) {
        return response.data as Task[]
      }
      throw new Error(response.error?.toString() || 'Failed to fetch tasks')
    },
    enabled,
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
