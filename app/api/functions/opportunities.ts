import apiService from '@/app/utils/apiService'

interface Opportunity {
  id: string
  status: string
  vehicle: {
    make: string
    model: string
    year: number
  }
  customer: {
    name: string
    email: string
    phone: string
  }
  // Add other fields as needed based on your API response
}

export const getOpportunitiesList = async (): Promise<Opportunity[]> => {
  const response = await apiService.get<Opportunity[]>('/Opportunity/List2')
  return response.data
}