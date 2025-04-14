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

interface Vehicle {
  make: string;
  model: string;
  year: string;
  vin: string;
}

export interface PartsOrderSummary {
  partsOrderId: string;
  vendor: {
    id: string;
    name: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
  };
  partsToOrderCount: number;
  partsToReceiveCount: number;
  partsToReturnCount: number;
  totalAmount: number;
  lastCommunicationDate: string;
  summary: string;
  hasCoreParts: boolean;


}

export interface Tech {
  id: string;
  name: string;
  profilePicture: string;
}

export interface TenantPartOrder {
  opportunityId: string;
  roNumber: string;
  vehicle: Vehicle;
  estimateAmount: number;
  estimatedCompletionDate: string;
  assignedTech:  Tech;
  partsOrders: PartsOrderSummary[];
}

export async function getPartOrdersByTenantId({
  tenantId,
}: {
  tenantId: string;
}): Promise<TenantPartOrder[]> {
  try {
    const response = await apiService.get<TenantPartOrder[]>(
      `/PartOrder/tenant/${tenantId}/opportunities`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tenant part orders:', error);
    throw error;
  }
}
