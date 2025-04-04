import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createOpportunityLog, OpportunityLogCreateVM } from '../functions/communication'

/**
 * Hook for creating a new opportunity log
 * @returns Mutation object for creating a log
 */
export function useCreateOpportunityLog() {
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: (logData: OpportunityLogCreateVM) => createOpportunityLog(logData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['opportunityLogs', variables.opportunityId] })
      queryClient.invalidateQueries({ queryKey: ['lastOpportunityLog', variables.opportunityId] })
    }
  })
  
  return {
    createLog: mutation.mutate,
    createLogAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset
  }
}
