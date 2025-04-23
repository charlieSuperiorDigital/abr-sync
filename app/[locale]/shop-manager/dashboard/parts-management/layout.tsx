'use client'
import PartsSummaryBar from '@/app/[locale]/custom-components/parts-summary-bar';
import { useGetTenantPartOrders } from '@/app/api/hooks/useParts';
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';
import { useSession } from 'next-auth/react';


export default function PartsManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const tenantId = session?.user?.tenantId;

    // Preload the cache
    const {
        ordersWithPartsToBeOrdered,
        ordersWithPartsToBeReceived,
        ordersWithPartsToBeReturned,
        ordersWithCoreParts,
        isLoading, error } = useGetTenantPartOrders({
            tenantId: tenantId || ''
        });


    
    return (
        <div className="flex flex-col w-full min-h-screen">
            <h1 className="px-5 my-7 text-3xl font-semibold tracking-tight">Parts Management</h1>
            {isLoading ? (
                <div>Loading parts data...</div>
            ) : error ? (
                <div>Error loading parts data</div>
            ) : (
                <>
                    <DraggableNav
                        navItems={[
                            {
                                id: 'to-order',
                                label: 'To Order',
                                count: ordersWithPartsToBeOrdered.length || 0
                            },
                            { id: 'to-receive', label: 'To Receive', count: ordersWithPartsToBeReceived.length || 0 },
                            { id: 'invoices', label: 'Invoices', count: 0 },
                            { id: 'received', label: 'Received', count: 0 },
                            { id: 'backordered', label: 'Backordered', count: 0 },
                            { id: 'cores', label: 'Cores', count: ordersWithCoreParts.length || 0 },
                            { id: 'returns', label: 'Returns', count: ordersWithPartsToBeReturned.length || 0 },
                            { id: 'vendors', label: 'Vendors', count: 0 },
                            { id: 'reports', label: 'Reports', count: 0 },
                        ]}
                    />
                    <PartsSummaryBar
                        
                    />
                    <main className="w-full">{children}</main>
                </>
            )}
        </div>
    );
}
