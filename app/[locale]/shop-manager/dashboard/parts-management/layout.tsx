import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';

export default function PartsManagementLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <h1 className="text-3xl font-semibold tracking-tight px-5 my-7">Parts Management</h1>
            <DraggableNav
                navItems={[
                    { id: 'to-order', label: 'To Order', count: 0 },
                    { id: 'to-receive', label: 'To Receive', count: 0 },
                    { id: 'invoices', label: 'Invoices', count: 0 },
                    { id: 'received', label: 'Received', count: 0 },
                    { id: 'insurance-approvals-needed', label: 'Insurance Approvals Needed', count: 0 },
                    { id: 'cores', label: 'Cores', count: 0 },
                    { id: 'returns', label: 'Returns', count: 0 },
                    { id: 'vendors', label: 'Vendors', count: 0 },
                    { id: 'reports', label: 'Reports', count: 0 },
                ]}
            />
            <main className="w-full">{children}</main>
        </div>
    );
}
