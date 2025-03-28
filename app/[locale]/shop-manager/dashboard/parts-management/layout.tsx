import PartsSummaryBar from '@/app/[locale]/custom-components/parts-summary-bar';
import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';
import { 
    toOrderMockData, 
    toReceiveMockData, 
    invoicesMockData, 
    receivedMockData, 
    backorderedMockData,
    returnsMockData 
} from '@/app/mocks/parts-management';

export default function PartsManagementLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
            <DraggableNav
                navItems={[
                    { id: 'to-order', label: 'To Order', count: toOrderMockData.length },
                    { id: 'to-receive', label: 'To Receive', count: toReceiveMockData.length },
                    { id: 'invoices', label: 'Invoices', count: invoicesMockData.length },
                    { id: 'received', label: 'Received', count: receivedMockData.length },
                    { id: 'backordered', label: 'Backordered', count: backorderedMockData.length },
                    { id: 'returns', label: 'Returns', count: returnsMockData.length },
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
        </div>
    );
}
