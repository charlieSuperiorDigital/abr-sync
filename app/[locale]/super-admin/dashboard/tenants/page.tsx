'use client'

import React from 'react'
import TenantDashboard from './client-tenant-dashboard'
import { useGetTenantList } from '@/app/api/hooks/useTenant'

const page = () => {
  const onlyActives = true
  const { tenants, isLoading, isError } = useGetTenantList({
    onlyActives,
    enabled: true,
  })
  return (
    <div className="w-full">
      <TenantDashboard
        tenants={tenants}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}

export default page
