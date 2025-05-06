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
  UpdateTaskPayload,
  GetTaskByIdApiResponse
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
 * @returns Query result with task data and task days
 */
export function useGetTaskById(options: UseGetTaskByIdOptions) {
  const { taskId, enabled = true } = options

  const { data, isLoading, error } = useQuery<GetTaskByIdApiResponse>({
    queryKey: ['task', taskId],
    queryFn: async () => {
      try {
        return await getTaskById(taskId)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch task')
      }
    },
    enabled: enabled && !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    task: data?.task,
    taskDays: data?.taskDays || [],
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
    queryKey: ['tasks', 'tenant', tenantId],
    queryFn: async () => {
      try {
        return await getTasksByTenant(tenantId)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch tenant tasks')
      }
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
      try {
        return await getTasksByAssignedUser(userId)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch assigned tasks')
      }
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
      try {
        return await getTasksByCreator(userId)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to fetch created tasks')
      }
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
  
  const mutation = useMutation<Task, Error, TaskCreateVM>({
    mutationFn: async (taskData) => {
      try {
        return await createTask(taskData)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create task')
      }
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
  
  const mutation = useMutation<Task, Error, UpdateTaskPayload>({
    mutationFn: async (taskData) => {
      try {
        return await updateTask(taskData)
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update task')
      }
    },
    onSuccess: (data, variables) => {
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
