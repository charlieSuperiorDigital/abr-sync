'use client'
import { useQuery } from '@tanstack/react-query'
import { getWorkfileByUserId, getWorkfileById } from '../functions/workfiles'
import { WorkfileApiResponse } from '@/app/types/workfile'

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
  const { data, isLoading, error } = useQuery<WorkfileApiResponse>({
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
    workfile: data?.workfile,
    sublets: data?.sublets,
    isLoading,
    error
  }
}