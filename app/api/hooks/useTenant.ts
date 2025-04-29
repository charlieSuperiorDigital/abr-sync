import { useQuery } from '@tanstack/react-query';
import { getTenantById, TenantWithLocations, getTenantList, getUsersByTenant, GetUsersByTenantResponse } from '../functions/tenant';
import { Tenant, TenantListItem } from '@/app/types/tenant';
import { User } from '@/app/types/user';

// --- useGetTenant ---
export interface UseGetTenantOptions {
  tenantId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch tenant data by ID
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with tenant data
 */
export function useGetTenant({ tenantId }: UseGetTenantOptions) {
  const { data, isLoading, error } = useQuery<TenantWithLocations>({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetTenant');
          throw new Error('No tenant ID provided');
        }
        return await getTenantById(tenantId);
      } catch (error) {
        console.error('Error in useGetTenant hook:', error);
        throw error;
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    tenant: data?.tenant,
    locations: data?.locations,
    isLoading,
    error,
  };
}

// --- useGetTenantList ---
export interface UseGetTenantListOptions {
  onlyActives: boolean;
  enabled?: boolean;
}
/**
 * Hook to fetch tenant list filtered by active status
 * @param options - Query options including onlyActives flag and enabled flag
 * @returns Query result with tenant list data
 */
export function useGetTenantList(options: UseGetTenantListOptions) {
  const { onlyActives, enabled = true } = options;
  const { data, isLoading, error, isError } = useQuery<TenantListItem[]>({
    queryKey: ['tenantList', onlyActives],
    queryFn: async () => {
      try {
        return await getTenantList(onlyActives);
      } catch (error) {
        console.error('Error in useGetTenantList hook:', error);
        throw error;
      }
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    tenants: data || [],
    isLoading,
    isError,
    error,
  };
}

// --- useGetUsersByTenant ---
export interface UseGetUsersByTenantOptions {
  tenantId: string;
  page?: number;
  perPage?: number;
}
/**
 * Hook to fetch users by tenant ID with pagination
 * @param options - Query options including tenantId, page, and perPage
 * @returns Query result with users data
 */
export function useGetUsersByTenant({ tenantId, page = 1, perPage = 10 }: UseGetUsersByTenantOptions) {
  const { data, isLoading, error } = useQuery<GetUsersByTenantResponse>({
    queryKey: ['users', 'tenant', tenantId, page, perPage],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetUsersByTenant');
          throw new Error('No tenant ID provided');
        }
        return await getUsersByTenant(tenantId, page, perPage);
      } catch (error) {
        console.error('Error in useGetUsersByTenant hook:', error);
        throw error;
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
  });
  return {
    users: data?.users || [],
    totalCount: data?.totalCount || 0,
    currentPage: data?.currentPage || 0,
    perPage: data?.perPage || 0,
    isLoading,
    error,
  };
}
