import { useQuery } from '@tanstack/react-query'
import { getOpportunityLogs } from '../functions/communication'

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
