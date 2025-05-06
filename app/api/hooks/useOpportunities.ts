import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createOpportunityLog,
  getOpportunityLogs,
  getLastOpportunityLog,
} from '../functions/communication'
import {
  OpportunityLogCreateVM,
  CreateOpportunityLogApiResponse,
  OpportunityLog
} from '@/app/types/communication-logs'
import {
  getOpportunitiesList,
  getOpportunityById,
} from '@/app/api/functions/opportunities'
import { 
  OpportunityResponse,
  GetOpportunityByIdApiResponse 
} from '@/app/types/opportunities'
import { isValidDate } from '@/app/utils/is-valid-date'
import { categorizeOpportunities } from '@/app/[locale]/shop-manager/dashboard/opportunities/utils/categorizeOpportunities'

/**
 * Hook to fetch opportunities for a specific tenant
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with opportunities data
 */
export function useGetOpportunities({ tenantId }: { tenantId: string }) {
  const { data, isLoading, error } = useQuery<OpportunityResponse[]>({
    queryKey: ['opportunities', tenantId],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetOpportunities')
          throw new Error('No tenant ID provided')
        }
        console.log(`Fetching opportunities for tenant ${tenantId}`)
        return await getOpportunitiesList({ tenantId })
      } catch (error) {
        console.error('Error in useGetOpportunities hook:', error)
        throw error
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  const result = categorizeOpportunities(data || [])

  // Filter opportunities based on different criteria
  // const newOpportunities =
  //   data?.filter(
  //     (opportunity) => opportunity.opportunityStatus.toLowerCase() === 'new'
  //   ) || []

  // const estimateOpportunities =
  //   data?.filter(
  //     (opportunity) =>
  //       opportunity.opportunityStatus.toLowerCase() === 'estimate'
  //   ) || []

  // const secondCallOpportunities =
  //   data?.filter(
  //     (opportunity) =>
  //       isValidDate(opportunity._1stCall) && isValidDate(opportunity._2ndCall)
  //   ) || []

  // const totalLossOpportunities =
  //   data?.filter(
  //     (opportunity) =>
  //       opportunity.insuranceTypeOfLoss.toLowerCase() === 'total loss'
  //   ) || []

  // const archivedOpportunities =
  //   data?.filter(
  //     (opportunity) =>
  //       opportunity.opportunityStatus.toLowerCase() === 'archived'
  //   ) || []

  return {
    newOpportunities: result.new,
    estimateOpportunities: result.estimate,
    secondCallOpportunities: result.secondCall,
    totalLossOpportunities: result.totalLoss,
    archivedOpportunities: result.archived,
    opportunities: data,
    isLoading,
    error,
  }
}

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
  const { data, isLoading, error } = useQuery<OpportunityLog[]>({
    queryKey: ['opportunityLogs', opportunityId],
    queryFn: () => getOpportunityLogs(opportunityId),
    enabled: options.enabled !== false && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    logs: data || [],
    isLoading,
    error,
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
  const { data, isLoading, error } = useQuery<OpportunityLog | null>({
    queryKey: ['lastOpportunityLog', opportunityId],
    queryFn: () => getLastOpportunityLog(opportunityId),
    enabled: options.enabled !== false && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    log: data || null,
    isLoading,
    error,
  }
}

/**
 * Hook for creating a new opportunity log
 * @returns Mutation object for creating a log
 */
export function useCreateOpportunityLog() {
  const queryClient = useQueryClient()

  const mutation = useMutation<
    CreateOpportunityLogApiResponse,
    Error,
    OpportunityLogCreateVM
  >({
    mutationFn: (logData: OpportunityLogCreateVM) =>
      createOpportunityLog(logData),
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ['opportunityLogs', variables.opportunityId],
      })
      queryClient.invalidateQueries({
        queryKey: ['lastOpportunityLog', variables.opportunityId],
      })
    },
  })

  return {
    createLog: mutation.mutate,
    createLogAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Hook for fetching a specific opportunity by its ID
 * @param opportunityId - The ID of the opportunity
 * @param options - Additional options for the query
 * @returns Query result with opportunity data, loading state, and error
 */
export function useGetOpportunityById(
  opportunityId: string,
  options: { enabled?: boolean } = {}
) {
  const { data, isLoading, error } = useQuery<GetOpportunityByIdApiResponse>({
    queryKey: ['opportunity', opportunityId],
    queryFn: async () => {
      try {
        if (!opportunityId) {
          console.log('No opportunity ID provided to useGetOpportunityById')
          throw new Error('No opportunity ID provided')
        }
        console.log(`Fetching opportunity with ID ${opportunityId}`)
        return await getOpportunityById({ opportunityId })
      } catch (error) {
        console.error('Error in useGetOpportunityById hook:', error)
        throw error
      }
    },
    enabled: options.enabled !== false && !!opportunityId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    opportunity: data,
    isLoading,
    error,
  }
}
