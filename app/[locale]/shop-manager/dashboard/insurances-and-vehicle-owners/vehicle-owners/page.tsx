'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import {
    TitleCell,
    ContactMethodCell,
    ActionsCell
} from '@/components/custom-components/custom-table/table-cells'

// Mock data for vehicle owners
const mockVehicleOwners = [
    { id: 1, name: "John Doe", vehicleCount: 2, phone: "(555) 123-4567", email: "john@example.com" },
    { id: 2, name: "Jane Smith", vehicleCount: 1, phone: "(555) 234-5678", email: "jane@example.com" },
    { id: 3, name: "Bob Johnson", vehicleCount: 3, phone: "(555) 345-6789", email: "bob@example.com" },
]

export default function VehicleOwnersPage() {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <TitleCell title={row.original.name} />
        },
        {
            accessorKey: 'contact',
            header: 'Contact',
            cell: ({ row }) => (
                <ContactMethodCell 
                    email={row.original.email}
                    phone={row.original.phone}
                />
            )
        },
        {
            accessorKey: 'vehicleCount',
            header: 'Vehicles',
            cell: ({ row }) => <TitleCell title={row.original.vehicleCount.toString()} />
        },
        {
            id: 'actions',
            header: '',
            cell: ({ row }) => 
            <ActionsCell
                actions={[
                    {
                        label: 'Edit',
                        onClick: () => console.log('Edit Owner:', row.original.id),
                        variant: 'secondary',
                        icon: 'edit'
                    },
                    {
                        label: 'Delete',
                        onClick: () => console.log('Delete Owner:', row.original.id),
                        variant: 'secondary',
                        icon: 'delete'
                    }
                ]}
            />
        }
    ]

    return (
        <div className="w-full">
            <DataTable
                columns={columns}
                data={mockVehicleOwners}
                pageSize={10}
                pageSizeOptions={[5, 10, 20, 30, 40, 50]}
                showPageSize={true}
            />
        </div>
    )
}
