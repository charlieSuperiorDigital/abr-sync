import { PartOrder } from "@/app/types/part-order";
import apiService from "@/app/utils/apiService";

export async function getPartOrdersByOpportunityId({
  opportunityId,

}: {
  opportunityId: string;
}): Promise<PartOrder[]> {
  try {
    const response = await apiService.get<PartOrder[]>(
      `/PartOrder/opportunity/${opportunityId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching part orders:', error)
    throw error;
  }
}

