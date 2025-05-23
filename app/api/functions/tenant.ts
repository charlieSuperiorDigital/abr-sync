import { Tenant, TenantListItem } from "@/app/types/tenant";
import { User } from "@/app/types/user";
import { Location } from "@/app/types/location";
import apiService from "@/app/utils/apiService";

export interface CreateTenantRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  logoUrl: string;
  cccApiKey: string;
}

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
        console.log('Locations:', data.locations)
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

/**
 * Get list of tenants filtered by active status
 * @param onlyActives - If true, only returns active tenants
 * @returns Promise with array of tenant list items
 */
export async function getTenantList(onlyActives: boolean): Promise<TenantListItem[]> {
  console.log(`Fetching tenant list with onlyActives=${onlyActives}`)
  try {
    const response = await apiService.get<TenantListItem[] | string>(
      `/Tenant/List/${onlyActives}`
    )
    
    // Check if the response is an error message string
    if (typeof response.data === 'string') {
      console.warn('API returned a string instead of tenant array:', response.data)
      // Return empty array for "No tenant found" case
      return [];
    }
    
    // Check if the response is valid
    if (!Array.isArray(response.data)) {
      console.error('API returned unexpected data type:', response.data)
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tenant list:', error)
    // Return empty array instead of throwing
    return [];
  }
}

/**
 * Error response from the API
 */
export interface ApiErrorResponse {
  type: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
  traceId: string;
}

/**
 * Create a new tenant
 * @param tenantData - The tenant data to create
 * @returns Promise with the created tenant ID
 * @throws ApiErrorResponse if validation fails
 */
export async function createTenant(tenantData: CreateTenantRequest): Promise<string> {
  console.log('Creating new tenant with data:', tenantData)
  try {
    // Ensure all required fields are present
    if (!tenantData.name || !tenantData.email || !tenantData.phone || 
        !tenantData.address || !tenantData.logoUrl || !tenantData.cccApiKey) {
      throw new Error('All tenant fields are required');
    }
    
    const response = await apiService.post<string>('/Tenant', tenantData)
    
    // Check if response data is an error object
    if (typeof response.data === 'object' && response.data !== null && 'status' in response.data) {
      const errorResponse = response.data as unknown as ApiErrorResponse;
      console.error('API returned error response:', errorResponse);
      throw errorResponse;
    }
    
    console.log('Tenant created successfully, response:', response.data)
    return response.data;
  } catch (error: any) {
    console.error('Error creating tenant:', error)
    
    // Check if it's an axios error with a response
    if (error.response && error.response.data) {
      console.error('API error response:', error.response.data);
      throw error.response.data;
    }
    
    throw error;
  }
}