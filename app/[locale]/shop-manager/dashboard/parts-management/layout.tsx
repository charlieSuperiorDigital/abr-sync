'use client'
import PartsSummaryBar from '@/app/[locale]/custom-components/parts-summary-bar';
import { useGetAllPartsFromTenant, useGetTenantPartOrders } from '@/app/api/hooks/useParts';
import DraggableNav, { NavItem } from '@/components/custom-components/draggable-nav/draggable-nav';
import { useSession } from 'next-auth/react';
import { useGetUserTabOrder } from '@/app/api/hooks/useGetUserTabOrder';
import { useUpdateUserTabOrder } from '@/app/api/hooks/useUpdateUserTabOrder';
import { useMemo } from 'react';


export default function PartsManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const tenantId = session?.user?.tenantId;
    const userId = session?.user?.userId || "341d96d2-a419-4c7a-a651-b8d54b71ace0"; // Default ID as fallback

    // Preload the cache
    const {
        ordersWithPartsToBeOrdered,
        ordersWithPartsToBeReceived,
        ordersWithPartsToBeReturned,
        ordersWithCoreParts,
        isLoading: isLoadingParts, 
        error 
    } = useGetTenantPartOrders({
        tenantId: tenantId || ''
    });

    const { getUniqueVendors: vendorsList } = useGetAllPartsFromTenant(tenantId || '');
    
    // Define the base nav items
    const baseNavItems: NavItem[] = [
        {
            id: 'to-order',
            label: 'To Order',
            count: ordersWithPartsToBeOrdered?.length || 0
        },
        { id: 'to-receive', label: 'To Receive', count: ordersWithPartsToBeReceived?.length || 0 },
        { id: 'invoices', label: 'Invoices', count: 0 },
        { id: 'received', label: 'Received', count: 0 },
        { id: 'cores', label: 'Cores', count: ordersWithCoreParts?.length || 0 },
        { id: 'returns', label: 'Returns', count: ordersWithPartsToBeReturned?.length || 0 },
        { id: 'vendors', label: 'Vendors', count: vendorsList?.length || 0 },
        { id: 'reports', label: 'Reports', count: 0 },
    ];
    
    // Get user's preferred tab order
    const { tabOrder, isLoading: isLoadingTabOrder } = useGetUserTabOrder({
        userId,
        pageName: 'parts-management',
        enabled: !!userId
    });
    
    // Setup tab order update mutation
    const { updateTabOrder } = useUpdateUserTabOrder({
        userId,
        pageName: 'parts-management',
    });
    
    // Wait for both parts data and tab order to load before showing content
    const isLoading = isLoadingParts || isLoadingTabOrder;
    
    // Order the nav items according to user's preference or use default order
    const partsNavItems = useMemo(() => {
        if (!tabOrder) return baseNavItems;
        return [...baseNavItems].sort((a, b) => {
            const aIndex = tabOrder.indexOf(a.id);
            const bIndex = tabOrder.indexOf(b.id);
            return aIndex - bIndex;
        });
    }, [baseNavItems, tabOrder]);



    return (
        <div className="flex flex-col w-full min-h-screen">
            <h1 className="px-5 text-3xl font-semibold tracking-tight my-7">Parts Management</h1>
            {isLoading ? (
                <div>Loading parts data...</div>
            ) : error ? (
                <div>Error loading parts data</div>
            ) : (
                <>
                    <DraggableNav
                        navItems={partsNavItems}
                        defaultTab={tabOrder?.[0] || 'to-order'}
                        onReorder={(reorderedItems) => {
                            // Extract the IDs in the new order
                            const newOrder = reorderedItems.map(item => item.id);
                            // Update the tab order in the database
                            updateTabOrder(newOrder);
                        }}
                    />
                    <PartsSummaryBar

                    />
                    <main className="w-full px-[20px]">{children}</main>
                </>
            )}
        </div>
    );
}
