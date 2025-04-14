import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  createOpportunityLog, 
  getOpportunityLogs, 
  getLastOpportunityLog,
  OpportunityLogCreateVM 
} from '../functions/communication'

/**
 * Hook for fetching all logs for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @param options - Additional options for the query
 * @returns Query result with logs data, loading state, and error
 */
export function useGetOpportunityLogs(
  opportunityId: string,
  options: { enabled?: boolean } = {}
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['opportunityLogs', opportunityId],
    queryFn: () => getOpportunityLogs(opportunityId),
    enabled: options.enabled !== false && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    logs: data?.data || [],
    isLoading,
    error
  }
}

/**
 * Hook for fetching the last communication log for a specific opportunity
 * @param opportunityId - The ID of the opportunity
 * @param options - Additional options for the query
 * @returns Query result with the last log data, loading state, and error
 */
export function useGetLastOpportunityLog(
  opportunityId: string,
  options: { enabled?: boolean } = {}
) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['lastOpportunityLog', opportunityId],
    queryFn: () => getLastOpportunityLog(opportunityId),
    enabled: options.enabled !== false && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    log: data?.data || null,
    isLoading,
    error
  }
}

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
