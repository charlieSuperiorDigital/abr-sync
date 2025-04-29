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

export async function getWorkfileByUserId({ userId }: { userId: string }) {
  try {
    const response = await apiService.get<WorkfileApiResponse[]>(
      `/Workfile/List/ByUser/${userId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching workfiles by user id:', error)
    throw error;
  }
}


export async function getWorkfileById({ workfileId }: { workfileId: string }) {
  try {
    const response = await apiService.get<WorkfileApiResponse>(
      `/Workfile/${workfileId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching workfile by id:', error)
    throw error;
  }
} 
