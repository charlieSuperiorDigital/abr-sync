'use client'
import React, { createContext, useContext, useEffect, useMemo } from 'react'
import { useGetWorkfiles } from '../api/hooks/useGetWorkfiles'
import { useSession } from 'next-auth/react'
import {
  WorkfileApiResponse,
  WorkfilesByTenantIdResponse,
} from '@/app/types/workfile'

interface WorkfilesContextType {
  workfiles: WorkfilesByTenantIdResponse[]
  upcomingWorkfiles: WorkfilesByTenantIdResponse[]
  inProgressWorkfiles: WorkfilesByTenantIdResponse[]
  qualityControlWorkfiles: WorkfilesByTenantIdResponse[]
  readyForPickupWorkfiles: WorkfilesByTenantIdResponse[]
  subletsWorkfiles: WorkfilesByTenantIdResponse[]
  laborWorkfiles: WorkfilesByTenantIdResponse[]
  reportsWorkfiles: WorkfilesByTenantIdResponse[]
  archiveWorkfiles: WorkfilesByTenantIdResponse[]
  workfilesQuantity: {
    upcoming: number
    inProgress: number
    qualityControl: number
    readyForPickup: number
    sublets: number
    labor: number
    reports: number
    archive: number
  }
  isLoading: boolean
  error: Error | null
}

const WorkfilesContext = createContext<WorkfilesContextType>({
  workfiles: [],
  upcomingWorkfiles: [],
  inProgressWorkfiles: [],
  qualityControlWorkfiles: [],
  readyForPickupWorkfiles: [],
  subletsWorkfiles: [],
  laborWorkfiles: [],
  reportsWorkfiles: [],
  archiveWorkfiles: [],
  workfilesQuantity: {
    upcoming: 0,
    inProgress: 0,
    qualityControl: 0,
    readyForPickup: 0,
    sublets: 0,
    labor: 0,
    reports: 0,
    archive: 0,
  },
  isLoading: false,
  error: null,
})

export const useWorkfiles = () => useContext(WorkfilesContext)

interface WorkfilesProviderProps {
  children: React.ReactNode
}

export const WorkfilesProvider = ({ children }: WorkfilesProviderProps) => {
  const { data: session } = useSession()

  const {
    workfiles,
    upcoming,
    inProgress,
    qualityControl,
    readyForPickup,
    sublets,
    labor,
    reports,
    archive,
    isLoading: isWorkfilesLoading,
    error,
  } = useGetWorkfiles({ tenantId: session?.user.tenantId! })

  // Memoize the workfiles quantity object
  const workfilesQuantity = useMemo(
    () => ({
      upcoming: upcoming?.length || 0,
      inProgress: inProgress?.length || 0,
      qualityControl: qualityControl?.length || 0,
      readyForPickup: readyForPickup?.length || 0,
      sublets: sublets?.length || 0,
      labor: labor?.length || 0,
      reports: reports?.length || 0,
      archive: archive?.length || 0,
    }),
    [
      workfiles,
      upcoming,
      inProgress,
      qualityControl,
      readyForPickup,
      sublets,
      labor,
      reports,
      archive,
    ]
  )

  // Combine loading states
  const isLoading = !session || isWorkfilesLoading

  // Log workfiles data when it changes
  useEffect(() => {
    if (session?.user.tenantId) {
      console.log(
        `Tenant ID from session for workfiles: ${session.user.tenantId}`
      )
    }

    if (workfiles && workfiles.length > 0) {
      console.log(
        `Loaded ${workfiles.length} workfiles for tenant ${session?.user.tenantId}`
      )
    } else if (!isLoading && session?.user.tenantId) {
      console.log(`No workfiles found for tenant ${session?.user.tenantId}`)
    }
  }, [workfiles, session, isLoading])

  return (
    <WorkfilesContext.Provider
      value={{
        workfiles: workfiles || [],
        upcomingWorkfiles: upcoming || [],
        inProgressWorkfiles: inProgress || [],
        qualityControlWorkfiles: qualityControl || [],
        readyForPickupWorkfiles: readyForPickup || [],
        subletsWorkfiles: sublets || [],
        laborWorkfiles: labor || [],
        reportsWorkfiles: reports || [],
        archiveWorkfiles: archive || [],
        workfilesQuantity,
        isLoading,
        error,
      }}
    >
      {children}
    </WorkfilesContext.Provider>
  )
}

export default WorkfilesProvider
