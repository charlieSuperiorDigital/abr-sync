import { Opportunity, OpportunityStatus } from '@/app/types/opportunities'
import { OpportunityResponse } from '@/app/types/opportunities'

/**
 * Maps an API response to the Opportunity type expected by the store
 * @param apiResponse The raw API response object
 * @returns A properly formatted Opportunity object
 */
export function mapApiResponseToOpportunity(apiResponse: OpportunityResponse): Opportunity {
  return {
    opportunityId: apiResponse.opportunityId,
    status: apiResponse.opportunityStatus as OpportunityStatus,
    stage: "Opportunity" as any, // Default stage
    createdDate: apiResponse.opportunityCreatedAt,
    lastUpdatedDate: apiResponse.opportunityUpdatedAt,
    priority: "Normal" as "Normal" | "High",
    
    vehicle: {
      vin: apiResponse.vehicleVin,
      make: apiResponse.vehicleMake,
      model: apiResponse.vehicleModel,
      year: apiResponse.vehicleYear,
      licensePlate: apiResponse.vehicleLicensePlate,
      exteriorColor: apiResponse.vehicleExteriorColor || '',
      interiorColor: apiResponse.vehicleInteriorColor || '',
      mileageIn: apiResponse.vehicleMileageIn,
      damageDescription: apiResponse.vehicleDamageDescription || '',
      vehiclePicturesUrls: apiResponse.vehiclePhotos?.map(photo => photo.url) || [],
      photos: apiResponse.vehiclePhotos?.map(photo => ({
        id: photo.id,
        url: photo.url,
        type: "exterior" as "exterior" | "interior" | "damage",
        dateAdded: new Date().toISOString()
      })) || []
    },
    
    owner: {
      name: `${apiResponse.ownerFirstName} ${apiResponse.ownerLastName}`,
      phone: apiResponse.ownerPhone,
      email: apiResponse.ownerEmail,
      address: apiResponse.ownerAddress
    },
    
    insurance: {
      company: apiResponse.insuranceName,
      claimNumber: apiResponse.insuranceClaimNumber,
      policyNumber: apiResponse.insurancePolicyNumber,
      deductible: parseFloat(apiResponse.insuranceDeductible) || 0,
      typeOfLoss: apiResponse.insuranceTypeOfLoss,
      representative: apiResponse.insuranceContactName,
      approved: apiResponse.insuranceApproved,
      adjuster: apiResponse.insuranceAdjuster,
      adjusterPhone: apiResponse.insuranceAdjusterPhone,
      adjusterEmail: apiResponse.insuranceAdjusterEmail
    },
    
    lastCommunicationSummary: apiResponse.lastCommunicationSummary,
    
    // Additional fields with defaults
    isArchived: false
  }
}
