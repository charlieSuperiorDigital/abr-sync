import DraggableNav from '@/components/custom-components/draggable-nav/draggable-nav';
import React from 'react';

export default function WorkfilesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="w-full">
            <h1 className="text-3xl font-semibold tracking-tight px-5 my-7">Work Files</h1>
            <DraggableNav
                navItems={[
                    { id: 'upcoming', label: 'Upcoming', count: 72 },
                    { id: 'in-progress', label: 'In Progress', count: 30 },
                    { id: 'quality-control', label: 'Quality Control', count: 2 },
                    { id: 'ready-for-pick-up', label: 'Ready For Pick-Up', count: 3 },
                    { id: 'sublets', label: 'Sublets', count: 6 },
                    { id: 'labor', label: 'Labor', count: 6 },
                    { id: 'reports', label: 'Reports', count: 6 },
                    { id: 'archive', label: 'Archive', count: 6 },
                ]}
                // baseUrl='/en/shop-manager/dashboard/workfiles'
            />
            {children}
        </div>
    )
}
