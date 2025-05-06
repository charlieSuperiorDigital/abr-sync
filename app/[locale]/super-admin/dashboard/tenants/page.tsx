'use client'

import React, { useEffect } from 'react'
import TenantDashboard from './client-tenant-dashboard'
import { useGetTenantList } from '@/app/api/hooks/useTenant'
import { Spinner } from '@/components/custom-components/spinner/spinner'

const page = () => {
  const onlyActives = true
  const { tenants, isLoading, isError } = useGetTenantList({
    onlyActives,
    enabled: true,
  })

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <Spinner />
      </div>
    )
  }
  if (isError) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p className="text-red-500">Error loading tenants</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <TenantDashboard tenants={tenants} />
    </div>
  )
}

export default page
