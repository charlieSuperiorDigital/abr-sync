import { useQuery } from '@tanstack/react-query'
import { getOpportunitiesList } from '@/app/api/functions/opportunities'

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

export const useGetOpportunities = () => {
  const { data, isLoading, error } = useQuery<Opportunity[]>({
    queryKey: ['opportunities'],
    queryFn: getOpportunitiesList,
    staleTime: 1 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
   
  })

  return {
    opportunities: data,
    isLoading,
    error,
  }
}