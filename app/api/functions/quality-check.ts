import apiService from '@/app/utils/apiService'
import { GetQualityCheckResponse, UpdateQualityCheckRequest, UpdateQualityCheckItemRequest, AddCustomCheckRequest, DeleteImageParams, DeleteCustomCheckParams } from '@/app/types/quality-check'

// Type for the upload response
export interface QualityCheckUploadResult {
  url: string;
  type: string;
  name: string;
}

export const createQualityCheck = async (workfileId: string) => {
  try {
    return await apiService.post<any>('/QualityCheck', { workfileId })
  } catch (error) {
    console.error('Error creating quality check:', error)
    throw error
  }
}

export const getQualityCheck = async (workfileId: string) => {
  try {
    console.log('Fetching quality check for workfile:', workfileId)
    return await apiService.get<GetQualityCheckResponse>(`/QualityCheck/${workfileId}`)
  } catch (error) {
    console.error('Error getting quality check:', error)
    throw error
  }
}

export const updateQualityCheck = async (data: UpdateQualityCheckRequest) => {
  try {
    return await apiService.put<void>('/QualityCheck/UpdateQualityCheck', data)
  } catch (error) {
    console.error('Error updating quality check:', error)
    throw error
  }
}

export const updateQualityCheckItem = async (data: UpdateQualityCheckItemRequest) => {
  try {
    return await apiService.put<void>('/QualityCheck/UpdateQualityCheckItem', data)
  } catch (error) {
    console.error('Error updating quality check item:', error)
    throw error
  }
}

export const addImageToQualityCheckItem = async (id: string, file: File): Promise<QualityCheckUploadResult> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiService.post<string>(`/QualityCheck/AddImageToQualityCheckItem?id=${id}`, formData)
    const url = response.data
    // Extract file name and type from the url
    const name = url.split('/').pop() || ''
    // Try to extract file type from extension
    let type = ''
    const extMatch = name.match(/\.([a-zA-Z0-9]+)$/)
    if (extMatch) {
      const ext = extMatch[1].toLowerCase()
      // Simple mapping for common types
      if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
        type = `image/${ext === 'jpg' ? 'jpeg' : ext}`
      } else {
        type = ext
      }
    }
    return { url, type, name }
  } catch (error) {
    console.error('Error adding image to quality check item:', error)
    throw error
  }
}

export const deleteImageFromQualityCheckItem = async ({ qualityCheckItemId, fileName }: DeleteImageParams) => {
  try {
    return await apiService.delete<void>(`/QualityCheck/DelImageToQualityCheckItem?qualityCheckItemId=${qualityCheckItemId}&fileName=${fileName}`)
  } catch (error) {
    console.error('Error deleting image from quality check item:', error)
    throw error
  }
}

export const addCustomCheck = async (data: AddCustomCheckRequest) => {
  try {
    return await apiService.post<void>('/QualityCheck/AddCustomCheck', data)
  } catch (error) {
    console.error('Error adding custom check:', error)
    throw error
  }
}

export const deleteCustomCheck = async ({ qualityCheckItemId }: DeleteCustomCheckParams) => {
  try {
    return await apiService.delete<void>(`/QualityCheck/DelCustomCheck?qualityCheckItemId=${qualityCheckItemId}`)
  } catch (error) {
    console.error('Error deleting custom check:', error)
    throw error
  }
}
