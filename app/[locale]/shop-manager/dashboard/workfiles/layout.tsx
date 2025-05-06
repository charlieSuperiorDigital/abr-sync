'use client'
import DraggableNav, { NavItem } from '@/components/custom-components/draggable-nav/draggable-nav'
import { useSession } from 'next-auth/react'
import { useGetWorkfiles } from '@/app/api/hooks/useGetWorkfiles'
import React, { useMemo } from 'react'
import { useGetUserTabOrder } from '@/app/api/hooks/useGetUserTabOrder'
import { useUpdateUserTabOrder } from '@/app/api/hooks/useUpdateUserTabOrder'

export default function WorkfilesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const tenantId = session?.user.tenantId
  const userId = session?.user?.userId || "341d96d2-a419-4c7a-a651-b8d54b71ace0" // Default ID as fallback

  if (!tenantId) {
    return <div>No tenant ID found</div>
  }

  const { workfilesQuantity, isLoading: isLoadingWorkfiles, error } = useGetWorkfiles({ tenantId })

  // Define the base nav items
  const baseNavItems: NavItem[] = [
    {
      id: 'upcoming',
      label: 'Upcoming',
      count: workfilesQuantity?.upcoming || 0,
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      count: workfilesQuantity?.inProgress || 0,
    },
    {
      id: 'quality-control',
      label: 'Quality Control',
      count: workfilesQuantity?.qualityControl || 0,
    },
    {
      id: 'ready-for-pick-up',
      label: 'Ready For Pick-Up',
      count: workfilesQuantity?.readyForPickup || 0,
    },
    { id: 'sublets', label: 'Sublets', count: workfilesQuantity?.sublets || 0 },
    { id: 'labor', label: 'Labor', count: workfilesQuantity?.labor || 0 },
    { id: 'reports', label: 'Reports', count: workfilesQuantity?.reports || 0 },
    { id: 'archive', label: 'Archive', count: workfilesQuantity?.archive || 0 },
  ]

  // Get user's preferred tab order
  const { tabOrder, isLoading: isLoadingTabOrder } = useGetUserTabOrder({
    userId,
    pageName: 'workfiles',
    enabled: !!userId
  })

  // Setup tab order update mutation
  const { updateTabOrder } = useUpdateUserTabOrder({
    userId,
    pageName: 'workfiles',
  })

  // Wait for both workfiles and tab order to load before showing content
  const isLoading = isLoadingWorkfiles || isLoadingTabOrder

  // Order the nav items according to user's preference or use default order
  const workfilesNavItems = useMemo(() => {
    if (!tabOrder) return baseNavItems
    return [...baseNavItems].sort((a, b) => {
      const aIndex = tabOrder.indexOf(a.id)
      const bIndex = tabOrder.indexOf(b.id)
      return aIndex - bIndex
    })
  }, [baseNavItems, tabOrder])

  if (error) {
    return <div>Error loading workfiles: {error.message}</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">
        Work Files
      </h1>
      <DraggableNav
        navItems={workfilesNavItems}
        defaultTab={tabOrder?.[0] || 'upcoming'}
        onReorder={(reorderedItems) => {
          // Extract the IDs in the new order
          const newOrder = reorderedItems.map(item => item.id)
          // Update the tab order in the database
          updateTabOrder(newOrder)
        }}
        // baseUrl='/en/shop-manager/dashboard/workfiles'
      />
      <main className="w-full px-[20px]">{children}</main>
    </div>
  )
}
