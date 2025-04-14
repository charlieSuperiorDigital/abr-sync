'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useGetTenant } from '../api/hooks/useGetTenant'
import { Tenant } from '../types/tenant'
import { useSession } from 'next-auth/react'
import { Location } from '../types/location'
import {jwtDecode} from 'jwt-decode'


interface TenantContextType {
  tenant: Tenant | undefined
  locations: Location[] | undefined
  isLoading: boolean
  error: Error | null
}

const TenantContext = createContext<TenantContextType>({
  tenant: undefined,
  locations: undefined,
  isLoading: false,
  error: null
})

export const useTenant = () => useContext(TenantContext)

interface TenantProviderProps {
  children: React.ReactNode
}

export const TenantProvider = ({
  children 
}: TenantProviderProps) => {
  const { data: session, status: sessionStatus } = useSession()
  const [tenantId, setTenantId] = useState<string | undefined>(undefined)

  // Enable the query only when we have a tenant ID
  const isEnabled = !!tenantId;

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      console.log('Session authenticated, user data:', session?.user)
      
      if (session?.user?.tenantId) {
        console.log('Found tenant ID in session:', session.user.tenantId)
        setTenantId(session.user.tenantId)
      }
    }
  }, [session, sessionStatus])

  const { tenant, locations, isLoading, error } = useGetTenant({
    tenantId: tenantId!,
    enabled: isEnabled
  })

  return (
    <TenantContext.Provider value={{ tenant, locations, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export default TenantProvider
