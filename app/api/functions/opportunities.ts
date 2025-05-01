import apiService from '@/app/utils/apiService'
import { GetOpportunityByIdApiResponse } from '@/app/types/opportunity'

export interface VehiclePhoto {
  id: string
  url: string
  type: string
  vehicleId: string
}

export interface OpportunityResponse {
  opportunityId: string
  opportunityStatus: string
  opportunityCreatedAt: string
  opportunityUpdatedAt: string

  // Insurance information
  insuranceName: string
  insuranceProvider: string
  insuranceClaimNumber: string
  insurancePolicyNumber: string
  insuranceTypeOfLoss: string
  insuranceDeductible: string
  insuranceContactName: string
  insuranceContactPhone: string
  insuranceCreatedAt: string
  insuranceUpdatedAt: string
  insuranceAdjuster: string
  insuranceAdjusterEmail: string
  insuranceAdjusterPhone: string
  insuranceApproved: boolean

  // Vehicle information
  vehicleId: string
  vehicleMake: string
  vehicleModel: string
  vehicleYear: number
  vehicleVin: string
  vehicleLicensePlate: string
  vehicleInteriorColor: string
  vehicleExteriorColor: string
  vehicleIsCommercial: boolean
  vehicleCreatedAt: string
  vehicleUpdatedAt: string
  vehicleDamageDescription: string
  vehicleMileageIn: number
  vehiclePhotos: VehiclePhoto[]

  // Owner information
  ownerFirstName: string
  ownerLastName: string
  ownerAddress: string
  ownerEmail: string
  ownerPhone: string
  ownerId: string
  ownerCreatedAt: string
  ownerUpdatedAt: string

  // Additional information
  totalParts: number
  totalPartsCost: number
  _1stCall: string
  _2ndCall: string
  lastCommunicationSummary: string
}

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
