import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, UpdateTaskPayload } from '../functions/tasks'

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

export default useUpdateTask;
