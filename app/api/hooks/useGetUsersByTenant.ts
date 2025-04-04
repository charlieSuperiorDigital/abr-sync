import { useQuery } from '@tanstack/react-query'
import { getUsersByTenant, GetUsersByTenantResponse } from '../functions/tenant'
import { User } from '@/app/types/user'

export interface UseGetUsersByTenantOptions {
  tenantId: string
  page?: number
  perPage?: number
}

/**
 * Hook to fetch users by tenant ID with pagination
 * @param options - Query options including tenantId, page, and perPage
 * @returns Query result with users data
 */
export function useGetUsersByTenant({ 
  tenantId , 
  page = 1, 
  perPage = 10 
}: UseGetUsersByTenantOptions) {
  const { data, isLoading, error } = useQuery<GetUsersByTenantResponse>({
    queryKey: ['users', 'tenant', tenantId, page, perPage],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetUsersByTenant')
          throw new Error('No tenant ID provided')
        }
        console.log(`Fetching users for tenant ${tenantId}`)
        return await getUsersByTenant(tenantId, page, perPage)
      } catch (error) {
        console.error('Error in useGetUsersByTenant hook:', error)
        throw error
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  })

  return {
    users: data?.users || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 0,
    perPage: data?.perPage || 0,
    isLoading,
    error
  }
}
