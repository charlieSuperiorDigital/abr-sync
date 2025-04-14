"use client"
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';
import { useSession } from 'next-auth/react';
import { useWorkfiles } from '@/app/context/WorkfilesProvider';
import React from 'react';

export default function WorkfilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const tenantId = session?.user.tenantId

  if (!tenantId) {
    return <div>No tenant ID found</div>
  }

  const { workfilesQuantity, isLoading, error } = useWorkfiles()

  if (error) {
    return <div>Error loading workfiles: {error.message}</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">Work Files</h1>
      <DraggableNav
        navItems={[
          { id: 'upcoming', label: 'Upcoming', count: workfilesQuantity.upcoming },
          { id: 'in-progress', label: 'In Progress', count: workfilesQuantity.inProgress },
          { id: 'quality-control', label: 'Quality Control', count: workfilesQuantity.qualityControl },
          { id: 'ready-for-pick-up', label: 'Ready For Pick-Up', count: workfilesQuantity.readyForPickup },
          { id: 'sublets', label: 'Sublets', count: workfilesQuantity.sublets },
          { id: 'labor', label: 'Labor', count: workfilesQuantity.labor },
          { id: 'reports', label: 'Reports', count: workfilesQuantity.reports },
          { id: 'archive', label: 'Archive', count: workfilesQuantity.archive },
        ]}
        // baseUrl='/en/shop-manager/dashboard/workfiles'
      />
      {children}
    </div>
  )
}
