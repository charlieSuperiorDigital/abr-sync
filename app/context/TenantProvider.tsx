'use client'
import React, { createContext, useContext, useEffect } from 'react'
import { useGetTenant } from '../api/hooks/useGetTenant'
import { Tenant } from '../types/tenant'
import { useSession } from 'next-auth/react'


interface TenantContextType {
  tenant: Tenant | undefined
  isLoading: boolean
  error: Error | null
}

const TenantContext = createContext<TenantContextType>({
  tenant: undefined,
  isLoading: false,
  error: null
})

export const useTenant = () => useContext(TenantContext)

interface TenantProviderProps {
  children: React.ReactNode
  tenantId?: string
}

export const TenantProvider = ({
  children,
  tenantId 
}: TenantProviderProps) => {
  const { data: session } = useSession()
  const { tenant, isLoading, error } = useGetTenant({tenantId: session?.user.tenant! })

  // Log tenant data when it changes
  useEffect(() => {
    if (tenant) {
      console.log('Tenant data loaded:', tenant.name)
    }
  }, [tenant])

  return (
    <TenantContext.Provider value={{ tenant, isLoading, error }}>
      {children}
    </TenantContext.Provider>
  )
}

export default TenantProvider
