import { PartOrder } from "@/app/types/part-order";
import { Part } from '@/app/types/parts';
import apiService from "@/app/utils/apiService";
import { Vehicle, PartsOrderSummary, Tech, TenantPartOrder, UpdatePartOrderRequest } from "../../types/parts";

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

export async function updatePartOrder(partOrderId: string, data: UpdatePartOrderRequest) {
  try {
    const response = await apiService.put<PartOrder[]>(
      `/PartOrder/${partOrderId}`,
      data
    )
    return response.data
  } catch (error) {
    console.error('Error updating part order:', error)
    throw error;
  }
}

// Rename getMockPartsOnReturnStatus to getPartsOnReturnStatus for production naming
export async function getPartsOnReturnStatus(): Promise<Part[]> {
  // TODO: Replace with real API call when backend is ready
  return [
    {
      id: '1',
      roNumber: 'R0001',
      vehicle: {
        make: 'Toyota',
        model: 'Corolla',
        year: '2022',
        vin: '1231232132132132',
      },
      description: 'Front Bumper',
      partNumber: 'FB-123',
      type: 0,
      status: 0,
      value: 250,
      quantity: 1,
      isCore: false,
      coreStatus: 0,
      coreCharge: 0,
      expectedDeliveryDate: '2025-04-17T15:07:25.137Z',
      orderedDate: '2025-04-17T15:07:25.137Z',
      orderedQuantity: 1,
      receivedDate: '2025-04-17T15:07:25.137Z',
      receivedQuantity: 1,
      returnAmount: 0,
      returnPickupDate: '2025-04-17T15:07:25.137Z',
      returnDate: '2025-04-17T15:07:25.137Z',
      refundStatus: 0,
      refundAmount: 0
    },
    // Add more mock Part objects as needed
  ];
}

//TODO: implement a function that updates a single part
//TODO: throw them all in the hook and use them on the returns page
