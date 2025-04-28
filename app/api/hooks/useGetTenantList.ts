import { useQuery } from '@tanstack/react-query'
import { getTenantList } from '../functions/tenant'
import { TenantListItem } from '@/app/types/tenant'

export interface UseGetTenantListOptions {
  onlyActives: boolean
  enabled?: boolean
}

/**
 * Hook to fetch tenant list filtered by active status
 * @param options - Query options including onlyActives flag and enabled flag
 * @returns Query result with tenant list data
 */
export function useGetTenantList(options: UseGetTenantListOptions) {
  const { onlyActives, enabled = true } = options;
  // Add debug logging
  console.log('useGetTenantList hook called with onlyActives:', onlyActives)

  const { data, isLoading, error, isError } = useQuery<TenantListItem[]>({
    queryKey: ['tenantList', onlyActives],
    queryFn: async () => {
      try {
        console.log(`Fetching tenant list with onlyActives=${onlyActives}`)
        return await getTenantList(onlyActives)
      } catch (error) {
        console.error('Error in useGetTenantList hook:', error)
        throw error
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Add debug logging for the returned data
  if (data) {
    console.log('useGetTenantList data returned:', {
      count: data.length,
      data: data,
      firstTenant: data.length > 0 ? data[0].name : 'none'
    })
  }
  
  if (isError) {
    console.error('Error in useGetTenantList:', error)
  }

  return {
    tenants: data || [],
    isLoading,
    isError,
    error
  }
}
