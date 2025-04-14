import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTask, TaskCreateVM } from '@/app/api/functions/tasks'

interface CreateTaskResponse {
  success: boolean
  data?: any
  error?: string
  status: number
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
 * Example usage:
 * 
 * import { useCreateTask } from '@/app/api/hooks/useCreateTask'
 * 
 * function TaskForm() {
 *   const { createTask, isLoading, error, isSuccess } = useCreateTask()
 *   
 *   const handleSubmit = (formData) => {
 *     createTask({
 *       tenantId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
 *       title: formData.title,
 *       description: formData.description,
 *       status: 'New',
 *       assignedTo: formData.assignedTo,
 *       workfileId: formData.workfileId,
 *       locationId: formData.locationId,
 *       dueDate: formData.dueDate,
 *       priority: formData.priority,
 *       type: formData.type,
 *       endDate: formData.endDate,
 *       roles: formData.roles
 *     })
 *   }
 *   
 *   return (
 *     <div>
 *       {isLoading && <p>Creating task...</p>}
 *       {error && <p>Error: {error.message}</p>}
 *       {isSuccess && <p>Task created successfully!</p>}
//  *       {/* Form components */
//  *     </div>
//  *   )
//  * }
//  */
