import apiService from "@/app/utils/apiService";

interface UpdateTabOrderRequest {
  pageName: string;
  tabOrder: string[];
}

/**
 * Get user's preferred tab order for a specific page
 * @param userId - The ID of the user
 * @param pageName - The name of the page to get tab order for
 * @returns Promise with the array of tab IDs in preferred order
 */
export async function getUserTabOrder(
  userId: string,
  pageName: string
): Promise<string[]> {
  console.log(`Fetching tab order for user ${userId} and page ${pageName}`);
  try {
    const { data } = await apiService.get<string[]>(
      `/User/TabOrder/${userId}/${pageName}`
    );
    return data;
  } catch (error) {
    console.error('Error fetching user tab order:', error);
    throw error;
  }
}

/**
 * Update user's preferred tab order for a specific page
 * @param userId - The ID of the user
 * @param pageName - The name of the page to update tab order for
 * @param tabOrder - The new order of tabs
 * @returns Promise with the updated tab order
 */
export async function updateUserTabOrder(
  userId: string,
  request: UpdateTabOrderRequest
): Promise<string[]> {
  console.log(`Updating tab order for user ${userId}`, request);
  try {
    const { data } = await apiService.put<string[]>(
      `/User/TabOrder/${userId}`,
      request
    );
    return data;
  } catch (error) {
    console.error('Error updating user tab order:', error);
    throw error;
  }
}
