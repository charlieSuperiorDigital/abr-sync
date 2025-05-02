import {
  WorkfileApiResponse,
  GetWorkfileByIdApiResponse,
  WorkfilesByTenantIdResponse,
} from '@/app/types/workfile'
import apiService from '@/app/utils/apiService'

// Interface for the workfiles by tenant ID API response

export async function getWorkfiles({ tenantId }: { tenantId: string }) {
  try {
    const response = await apiService.get<WorkfilesByTenantIdResponse[]>(
      `/Workfile/List/${tenantId}`
    )
    console.log('Workfiles response:', response.data)
    return response.data
  } catch (error) {
    console.error('Error fetching workfiles:', error)
    throw error
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
    throw error
  }
}

export async function getWorkfileById({ workfileId }: { workfileId: string }) {
  try {
    const response = await apiService.get<GetWorkfileByIdApiResponse>(
      `/Workfile/${workfileId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching workfile by id:', error)
    throw error
  }
}

export async function getWorkfilesByTenantId({
  tenantId,
}: {
  tenantId: string
}) {
  try {
    const response = await apiService.get<WorkfilesByTenantIdResponse[]>(
      `/Workfile/List/${tenantId}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching workfiles by tenant id:', error)
    throw error
  }
}
