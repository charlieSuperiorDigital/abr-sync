import { useQuery } from '@tanstack/react-query'
import { getLastOpportunityLog } from '../functions/communication'

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
