import apiService from "@/app/utils/apiService";

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
