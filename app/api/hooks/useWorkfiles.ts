'use client'
import { useQuery } from '@tanstack/react-query'
import { getWorkfileByUserId, getWorkfileById, getWorkfilesByTenantId } from '../functions/workfiles'
import { WorkfileApiResponse, GetWorkfileByIdApiResponse, WorkfilesByTenantIdResponse } from '@/app/types/workfile'

interface UseGetWorkfilesByUserIdOptions {
  userId: string
  enabled?: boolean
}

/**
 * Fetches workfiles for a specific user and returns them categorized by status
 * @param options - Query options including userId and enabled flag
 * @returns Query result with categorized workfiles data
 */
export function useGetWorkfilesByUserId({ userId, enabled = true }: UseGetWorkfilesByUserIdOptions) {
  const { data, isLoading, error } = useQuery<WorkfileApiResponse[]>({
    queryKey: ['workfilesByUser', userId],
    queryFn: async () => {
      try {
        if (!userId) {
          console.log('No user ID provided to useGetWorkfilesByUserId')
          throw new Error('No user ID provided')
        }
        console.log(`Fetching workfiles for user ${userId}`)
        return await getWorkfileByUserId({ userId })
      } catch (error) {
        console.error('Error in useGetWorkfilesByUserId hook:', error)
        throw error
      }
    },
    enabled: !!userId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  })

  // Filter workfiles by status
  const upcoming = data?.filter(w => w.workfile.status.toLowerCase() === 'upcoming') || []
  const inProgress = data?.filter(w => w.workfile.status.toLowerCase() === 'in progress') || []
  const qualityControl = data?.filter(w => w.workfile.status.toLowerCase() === 'qc') || []
  const readyForPickup = data?.filter(w => w.workfile.status.toLowerCase() === 'ready for pickup') || []
  const sublets = data?.filter(w => w.workfile.status.toLowerCase() === 'sublets') || []
  const labor = data?.filter(w => w.workfile.status.toLowerCase() === 'labor') || []
  const reports = data?.filter(w => w.workfile.status.toLowerCase() === 'reports') || []
  const archive = data?.filter(w => w.workfile.status.toLowerCase() === 'archive') || []

  const workfilesQuantity = {
    upcoming: upcoming.length,
    inProgress: inProgress.length,
    qualityControl: qualityControl.length,
    readyForPickup: readyForPickup.length,
    sublets: sublets.length,
    labor: labor.length,
    reports: reports.length,
    archive: archive.length,
    total: (data || []).length
  }

  return {
    upcoming,
    inProgress,
    qualityControl,
    readyForPickup,
    sublets,
    labor,
    reports,
    archive,
    workfiles: data,
    isLoading,
    error,
    workfilesQuantity
  }
} 

interface UseGetWorkfileByIdOptions {
  workfileId: string
  enabled?: boolean
}

/**
 * Fetches a specific workfile by its ID
 * @param options - Query options including workfileId and enabled flag
 * @returns Query result with workfile data
 */
export function useGetWorkfileById({ workfileId, enabled = true }: UseGetWorkfileByIdOptions) {
  const { data, isLoading, error } = useQuery<GetWorkfileByIdApiResponse>({
    queryKey: ['workfile', workfileId],
    queryFn: async () => {
      try {
        if (!workfileId) {
          console.log('No workfile ID provided to useGetWorkfileById')
          throw new Error('No workfile ID provided')
        }
        console.log(`Fetching workfile with ID ${workfileId}`)
        return await getWorkfileById({ workfileId })
      } catch (error) {
        console.error('Error in useGetWorkfileById hook:', error)
        throw error
      }
    },
    enabled: !!workfileId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  })

  return {
    workfile: data,
    isLoading,
    error
  }
}

interface UseGetWorkfilesByTenantIdOptions {
  tenantId: string
  enabled?: boolean
}

/**
 * Fetches workfiles for a specific tenant
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with workfiles data
 */
export function useGetWorkfilesByTenantId({ tenantId, enabled = true }: UseGetWorkfilesByTenantIdOptions) {
  const { data, isLoading, error } = useQuery<WorkfilesByTenantIdResponse[]>({
    queryKey: ['workfilesByTenant', tenantId],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetWorkfilesByTenantId')
          throw new Error('No tenant ID provided')
        }
        console.log(`Fetching workfiles for tenant ${tenantId}`)
        return await getWorkfilesByTenantId({ tenantId })
      } catch (error) {
        console.error('Error in useGetWorkfilesByTenantId hook:', error)
        throw error
      }
    },
    enabled: !!tenantId && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  })

  // Filter workfiles by status
  const upcoming = data?.filter(w => w.status.toLowerCase() === 'upcoming') || []
  const inProgress = data?.filter(w => w.status.toLowerCase() === 'in progress') || []
  const qualityControl = data?.filter(w => w.status.toLowerCase() === 'qc') || []
  const readyForPickup = data?.filter(w => w.status.toLowerCase() === 'ready for pickup') || []
  const archived = data?.filter(w => w.status.toLowerCase() === 'archived') || []

  const workfilesQuantity = {
    upcoming: upcoming.length,
    inProgress: inProgress.length,
    qualityControl: qualityControl.length,
    readyForPickup: readyForPickup.length,
    archived: archived.length,
    total: (data || []).length
  }

  return {
    upcoming,
    inProgress,
    qualityControl,
    readyForPickup,
    archived,
    workfiles: data,
    isLoading,
    error,
    workfilesQuantity
  }
}