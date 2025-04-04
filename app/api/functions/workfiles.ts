import { WorkfileApiResponse } from "@/app/types/workfile"
import apiService from "@/app/utils/apiService"

export async function getWorkfiles({ tenantId }: { tenantId: string }) {
    try {
      const response = await apiService.get<WorkfileApiResponse[]>(
        `/Workfile/List/${tenantId}`
      )
      return response.data
    } catch (error) {
      console.error('Error fetching workfiles:', error)
      throw error;
    }
  }