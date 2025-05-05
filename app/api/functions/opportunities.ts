import apiService from '@/app/utils/apiService'
import { 
  OpportunityResponse,
  VehiclePhoto,
  GetOpportunityByIdApiResponse
} from '@/app/types/opportunities'

export const getOpportunitiesList = async ({
  tenantId,
}: {
  tenantId: string
}): Promise<OpportunityResponse[]> => {
  try {
    const response = await apiService.get<OpportunityResponse[]>(
      `/Opportunity/List/${tenantId}`
    )
    console.log('Opportunities length:', response.data.length)
    return response.data
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    throw error
  }
}

export const getOpportunityById = async ({ opportunityId }: { opportunityId: string }): Promise<GetOpportunityByIdApiResponse> => {
  try {
    const response = await apiService.get<GetOpportunityByIdApiResponse>(`/Opportunity/${opportunityId}`)
    console.log('Fetched opportunity:', opportunityId)
    return response.data
  } catch (error) {
    console.error('Error fetching opportunity by id:', error)
    throw error;
  }
}
