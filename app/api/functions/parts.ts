import { PartOrder } from "@/app/types/part-order";
import {  PartWithFullDetails } from '@/app/types/parts';
import apiService from "@/app/utils/apiService";
import { TenantPartOrder, UpdatePartOrderRequest } from "../../types/parts";
import { Part } from "@/docs/parts-management-data-structure";

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
export async function getAllPartsFromTenant(tenantId: string): Promise<PartWithFullDetails[]> {
  try {
    const response = await apiService.get<PartWithFullDetails[]>(
      `/Parts/tenant/${tenantId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all parts from tenant:', error);
    throw error;
  }
}

export async function getPartsByOpportunityId(opportunityId: string): Promise<PartWithFullDetails[]> {
  try {
    const response = await apiService.get<PartWithFullDetails[]>(
      `/Parts/opportunity/${opportunityId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching parts by opportunity ID:', error);
    throw error;
  }
}

//TODO: implement a function tat gets parts on return status
//TODO: implement a function that updates a single part
//TODO: throw them all in the hook and use them on the returns page
