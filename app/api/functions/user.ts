import { User } from "@/app/types/user";
import apiService from "@/app/utils/apiService";

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  preferredLanguage?: string;
  phoneNumber?: string;
  hourlyRate?: number;
  modules?: number;
  communication?: number;
  notificationType?: number;
  notification?: number;
  profilePicture?: string;
}

export interface GetUsersListResponse {
  currentPage: number;
  perPage: number;
  totalCount: number;
  users: User[];
}

/**
 * Get detailed users list by tenant ID with pagination
 * This endpoint returns additional user data including phone numbers
 * @param tenantId - The ID of the tenant
 * @param page - Page number (default: 1)
 * @param perPage - Number of items per page (default: 10)
 * @returns Promise with detailed users data including phone numbers
 */
export async function getUsersList(
  tenantId: string,
  page: number = 1,
  perPage: number = 10
): Promise<GetUsersListResponse> {
  console.log(`Fetching detailed users list for tenant ${tenantId}`)
  try {
    const { data } = await apiService.get<GetUsersListResponse>(
      `/User/List/${tenantId}`
    )
    
    return data;
  } catch (error) {
    console.error('Error fetching detailed users list:', error)
    throw error;
  }
}

/**
 * Update user information
 * @param userId - The ID of the user to update
 * @param updateData - The data to update for the user
 * @returns Promise with the updated user data
 */
export async function updateUser(
  userId: string,
  updateData: UpdateUserRequest
): Promise<User> {
  console.log(`Updating user ${userId} with data:`, updateData);
  try {
    const { data } = await apiService.put<User>(
      `/User/${userId}`,
      updateData
    );
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}
