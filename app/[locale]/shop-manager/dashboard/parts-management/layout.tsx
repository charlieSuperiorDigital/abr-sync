'use client'
import PartsSummaryBar from '@/app/[locale]/custom-components/parts-summary-bar';
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';
import { useGetTenantPartOrders } from '@/app/api/hooks/useGetTenantPartOrders';
import { useSession } from 'next-auth/react';
import {
    toOrderMockData,
    toReceiveMockData,
    invoicesMockData,
    receivedMockData,
    backorderedMockData,
    returnsMockData,
    coresMockData
} from '@/app/mocks/parts-management';
import { vendorsMockData } from '@/app/mocks/vendors';

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

    // Calculate summary metrics
    const draftInvoices = invoicesMockData.filter(inv => inv.approvalStatus === 'pending').length;
    const backorders = backorderedMockData.length;
    const pending = toOrderMockData.filter(order => order.status === 'PENDING_APPROVAL').length;
    const changes = toOrderMockData.filter(order => order.status === 'APPROVED').length;
    const missed = toReceiveMockData.filter(item =>
        new Date(item.expectedDeliveryDate) < new Date()
    ).length;
    const inToday = toReceiveMockData.filter(item => {
        const today = new Date();
        const deliveryDate = new Date(item.expectedDeliveryDate);
        return deliveryDate.toDateString() === today.toDateString();
    }).length;
    const returns = returnsMockData.length;

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
                        draftInvoices={draftInvoices}
                        backorders={backorders}
                        pending={pending}
                        changes={changes}
                        missed={missed}
                        inToday={inToday}
                        returns={returns}
                        draftInvoicesWarning={false}
                        backordersWarning={false}
                        pendingWarning={false}
                        changesWarning={false}
                        missedWarning={false}
                        inTodayWarning={true}
                        returnsWarning={false}
                    />
                    <main className="w-full">{children}</main>
                </>
            )}
        </div>
    );
}
