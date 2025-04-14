import { useQuery } from '@tanstack/react-query'
import { getTenantById, TenantWithLocations } from '../functions/tenant'
import { Tenant } from '@/app/types/tenant'

export interface UseGetTenantOptions {
  tenantId: string
  enabled?: boolean
}

/**
 * Hook to fetch tenant data by ID
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with tenant data
 */
export function useGetTenant({ tenantId }: UseGetTenantOptions) {
  // Add debug logging
  console.log('useGetTenant hook called with tenantId:', tenantId)

  const { data, isLoading, error } = useQuery<TenantWithLocations>({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetTenant')
          throw new Error('No tenant ID provided')
        }
        console.log(`Fetching tenant ${tenantId}`)
        return await getTenantById(tenantId)
      } catch (error) {
        console.error('Error in useGetTenant hook:', error)
        throw error
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    
  })

  // Add debug logging for the returned data
  if (data) {
    console.log('useGetTenant data returned:', {
      tenant: data.tenant?.name,
      locationsCount: data.locations?.length || 0
    })
  }

  return {
    tenant: data?.tenant,
    locations: data?.locations,
    isLoading,
    error
  }
}
