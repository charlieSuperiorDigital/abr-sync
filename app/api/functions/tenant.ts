import { Tenant } from "@/app/types/tenant";
import { User } from "@/app/types/user";
import { Location } from "@/app/types/location";
import apiService from "@/app/utils/apiService";

export interface GetUsersByTenantResponse {
  currentPage: number;
  perPage: number;
  totalCount: number;
  users: User[];
}

export interface TenantWithLocations {
  tenant: Tenant;
  locations: Location[];
}

export async function getTenantById(id: string): Promise<TenantWithLocations> {
    console.log('Fetching tenant by ID:', id)
    try {
        const { data } = await apiService.get<TenantWithLocations>(`/Tenant/${id}`)
        return data;
    } catch (error) {
        console.error('Error fetching tenant:', error)
        throw error
    }
}

/**
 * Get users by tenant ID with pagination
 * @param tenantId - The ID of the tenant
 * @param page - Page number (default: 1)
 * @param perPage - Number of items per page (default: 10)
 * @returns Promise with users data
 */
export async function getUsersByTenant(
  tenantId: string,
  page: number = 1,
  perPage: number = 10
): Promise<GetUsersByTenantResponse> {
  console.log(`Fetching users for tenant ${tenantId}, page ${page}, perPage ${perPage}`)
  try {
    const { data } = await apiService.get<GetUsersByTenantResponse>(
      `/Authorization/TenantUsers/${page}/${perPage}/${tenantId}`
    )
    
    return data;
  } catch (error) {
    console.error('Error fetching users by tenant:', error)
    throw error;
  }
}