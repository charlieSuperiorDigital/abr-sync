'use client'
import { useQuery } from '@tanstack/react-query'
import { getWorkfiles } from '../functions/workfiles'
import { WorkfileApiResponse } from '@/app/types/workfile'

interface UseGetWorkfilesOptions {
  tenantId: string
  enabled?: boolean
}

/**
 * Fetches workfiles for a specific tenant and returns them categorized by status
 * @param options - Query options including tenantId and enabled flag
 * @returns Query result with categorized workfiles data
 */
export function useGetWorkfiles({ tenantId, enabled = true }: UseGetWorkfilesOptions) {
  const { data, isLoading, error } = useQuery<WorkfileApiResponse[]>({
    queryKey: ['workfiles', tenantId],
    queryFn: async () => {
      try {
        if (!tenantId) {
          console.log('No tenant ID provided to useGetWorkfiles')
          throw new Error('No tenant ID provided')
        }
        console.log(`Fetching workfiles for tenant ${tenantId}`)
        return await getWorkfiles({ tenantId })
      } catch (error) {
        console.error('Error in useGetWorkfiles hook:', error)
        throw error
      }
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once
    refetchOnWindowFocus: false // Don't refetch when window gains focus
  })

  // Filter workfiles by status
  const upcoming = data?.filter(w => w.status.toLowerCase() === 'upcoming') || []
  const inProgress = data?.filter(w => w.status.toLowerCase() === 'in progress') || []
  const qualityControl = data?.filter(w => w.status.toLowerCase() === 'qc') || []
  const readyForPickup = data?.filter(w => w.status.toLowerCase() === 'ready for pickup') || []
  const sublets = data?.filter(w => w.status.toLowerCase() === 'sublets') || []
  const labor = data?.filter(w => w.status.toLowerCase() === 'labor') || []
  const reports = data?.filter(w => w.status.toLowerCase() === 'reports') || []
  const archive = data?.filter(w => w.status.toLowerCase() === 'archive') || []

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
