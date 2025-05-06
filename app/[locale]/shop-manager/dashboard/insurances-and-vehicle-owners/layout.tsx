'use client'

import DraggableNav, { NavItem } from '@/components/custom-components/draggable-nav/draggable-nav'
import { useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useGetUserTabOrder } from '@/app/api/hooks/useGetUserTabOrder'
import { useUpdateUserTabOrder } from '@/app/api/hooks/useUpdateUserTabOrder'

export default function InsurancesAndVehicleOwnersLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Get the current authenticated user
    const { data: session } = useSession()
    const userId = session?.user?.userId || "341d96d2-a419-4c7a-a651-b8d54b71ace0" // Default ID as fallback

    // Define the nav items
    const navItems: NavItem[] = [
        { id: 'insurances', label: 'Insurances', count: 0 },
        { id: 'vehicle-owners', label: 'Vehicle Owners', count: 0 },
    ]

    // Get user's preferred tab order
    const { tabOrder, isLoading: isLoadingTabOrder } = useGetUserTabOrder({
        userId,
        pageName: 'insurances-and-vehicle-owners',
        enabled: !!userId
    })

    // Setup tab order update mutation
    const { updateTabOrder } = useUpdateUserTabOrder({
        userId,
        pageName: 'insurances-and-vehicle-owners',
    })

    // Order the nav items according to user's preference or use default order
    const orderedNavItems = useMemo(() => {
        if (!tabOrder) return navItems
        return [...navItems].sort((a, b) => {
            const aIndex = tabOrder.indexOf(a.id)
            const bIndex = tabOrder.indexOf(b.id)
            return aIndex - bIndex
        })
    }, [navItems, tabOrder])

    return (
        <div className="flex flex-col w-full min-h-screen">
            <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">Insurances & Vehicle Owners</h1>
            <div className="px-5">
                <DraggableNav 
                    navItems={orderedNavItems}
                    defaultTab={tabOrder?.[0] || 'insurances'}
                    onReorder={(reorderedItems) => {
                        // Extract the IDs in the new order
                        const newOrder = reorderedItems.map(item => item.id)
                        // Update the tab order in the database
                        updateTabOrder(newOrder)
                    }}
                />
            </div>
            <main className="w-full">{children}</main>
        </div>
    )
}
