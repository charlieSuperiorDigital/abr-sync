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
export function useGetTenant({ tenantId='2A9B6E40-5ACB-40A0-8E2B-D559B4829FA0' }: UseGetTenantOptions) {


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
    enabled: !!tenantId
  })

  return {
    tenant: data?.tenant,
    locations: data?.locations,
    isLoading,
    error
  }
}
