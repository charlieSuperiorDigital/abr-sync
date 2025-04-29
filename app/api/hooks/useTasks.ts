import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  createTask, 
  getTaskById, 
  getTasksByTenant, 
  getTasksByAssignedUser, 
  getTasksByCreator, 
  updateTask,
  Task,
  TaskCreateVM,
  UpdateTaskPayload
} from '../functions/tasks'

// Response interfaces
interface CreateTaskResponse {
  success: boolean
  data?: any
  error?: string
  status: number
}

// Option interfaces
export interface UseGetTaskByIdOptions {
  taskId: string
  enabled?: boolean
}

export interface UseGetTasksOptions {
  tenantId?: string
  enabled?: boolean
}

export interface UseGetTasksByAssignedUserOptions {
  userId: string
  enabled?: boolean
}

export interface UseGetTasksByCreatorOptions {
  userId: string
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

/**
 * React Query hook for creating tasks
 * @returns Mutation object with mutate function and status indicators
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient()
  
  const mutation = useMutation<CreateTaskResponse, unknown, TaskCreateVM>({
    mutationFn: async (taskData) => {
      const response = await createTask(taskData)
      if (!response.success) {
        throw new Error(typeof response.error === 'string' 
          ? response.error 
          : 'Failed to create task')
      }
      return response
    },
    onSuccess: () => {
      // Invalidate and refetch tasks queries when a new task is created
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
    retry: 1, // Only retry once
    onError: (error) => {
      console.error('Task creation failed:', error)
    }
  })

  return {
    createTask: mutation.mutate,
    createTaskAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data
  }
}

/**
 * Hook for updating a task
 * @returns Mutation object for updating a task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (taskData: UpdateTaskPayload) => updateTask(taskData),
    onSuccess: (data: any, variables: UpdateTaskPayload) => {
      // Invalidate the specific task query
      queryClient.invalidateQueries({ queryKey: ['task', variables.id] });
      
      // Also invalidate any task lists that might contain this task
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasksByAssignedUser'] });
      queryClient.invalidateQueries({ queryKey: ['tasksByCreator'] });
    }
  });
  
  return {
    updateTask: mutation.mutate,
    updateTaskAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  };
}
