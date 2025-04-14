import { useQuery } from '@tanstack/react-query'
import { getOpportunitiesList, OpportunityResponse } from '@/app/api/functions/opportunities'
import { isValidDate } from '@/app/utils/is-valid-date'

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

  // Filter opportunities based on different criteria
  const newOpportunities = data?.filter(opportunity => 
    opportunity.opportunityStatus.toLowerCase() === 'new'
  ) || []

  const estimateOpportunities = data?.filter(opportunity => 
    opportunity.opportunityStatus.toLowerCase() === 'estimate'
  ) || []

  const secondCallOpportunities = data?.filter(opportunity => 
    isValidDate(opportunity._1stCall) && isValidDate(opportunity._2ndCall)
  ) || []

  const totalLossOpportunities = data?.filter(opportunity => 
    opportunity.insuranceTypeOfLoss.toLowerCase() === 'total loss'
  ) || []

  const archivedOpportunities = data?.filter(opportunity => 
    opportunity.opportunityStatus.toLowerCase() === 'archived'
  ) || []

  return {
    newOpportunities,
    estimateOpportunities,
    secondCallOpportunities,
    totalLossOpportunities,
    archivedOpportunities,
    opportunities: data,
    isLoading,
    error
  }
}