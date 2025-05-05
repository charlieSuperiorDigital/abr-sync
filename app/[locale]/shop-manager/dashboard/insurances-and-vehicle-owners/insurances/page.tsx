'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import {
    TitleCell,
    AutoCell,
    FriendlyDateCell,
    UserAvatarCell,
    SummaryCell,
    ContactMethodCell
} from '@/components/custom-components/custom-table/table-cells'

// Mock data for insurances
const mockInsurances = [
    { 
        id: 1, 
        name: "Progressive",
        pendingEst: 23,
        pendingReim: 34,
        updates: 1,
        roDue: 295.00,
        roComp: 100,
        adjuster: { name: "Tom Roberts", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Last update: Vehicle inspection completed"
    },
    { 
        id: 2, 
        name: "Geico",
        pendingEst: 34,
        pendingReim: 10,
        updates: 2,
        roDue: 4295.00,
        roComp: 234,
        adjuster: { name: "Jessie White", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Pending approval for estimate #1234"
    },
    { 
        id: 3, 
        name: "AllState",
        pendingEst: 10,
        pendingReim: 15,
        updates: 0,
        roDue: 5300.00,
        roComp: 395,
        adjuster: { name: "Matthew Brown", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Waiting for parts delivery confirmation"
    },
    { 
        id: 4, 
        name: "PinnacleProtect Insurance",
        pendingEst: 12,
        pendingReim: 0,
        updates: 0,
        roDue: 1200.00,
        roComp: 32,
        adjuster: { name: "William Green", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "New claim filed for vehicle damage"
    },
    { 
        id: 5, 
        name: "SafeHarbor Insurance",
        pendingEst: 34,
        pendingReim: 0,
        updates: 0,
        roDue: 4295.00,
        roComp: 243,
        adjuster: { name: "Charlie Thompson", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Estimate approved, awaiting parts"
    },
    { 
        id: 6, 
        name: "PrimeSure Insurance",
        pendingEst: 0,
        pendingReim: 0,
        updates: 0,
        roDue: 2265.00,
        roComp: 125,
        adjuster: { name: "Jack Laurens", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Final inspection scheduled"
    },
    { 
        id: 7, 
        name: "ABC Insurance",
        pendingEst: 0,
        pendingReim: 0,
        updates: 0,
        roDue: 1270.00,
        roComp: 385,
        adjuster: { name: "Elijah Miller", avatarUrl: "" },
        lastCommDate: "2025-05-01T12:34:00",
        summary: "Payment processing in progress"
    }
]

export default function InsurancesPage() {
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => <TitleCell title={row.original.name} />
        },
        {
            accessorKey: 'pendingEst',
            header: 'Pending Est.',
            cell: ({ row }) => (
                <Badge 
                    variant="secondary" 
                    className="bg-blue-100 text-blue-800 hover:bg-blue-100"
                >
                    {row.original.pendingEst}
                </Badge>
            )
        },
        {
            accessorKey: 'pendingReim',
            header: 'Pending Reim.',
            cell: ({ row }) => (
                <Badge 
                    variant="secondary" 
                    className="bg-red-100 text-red-800 hover:bg-red-100"
                >
                    {row.original.pendingReim}
                </Badge>
            )
        },
        {
            accessorKey: 'updates',
            header: 'Updates',
            cell: ({ row }) => (
                <Badge 
                    variant="secondary" 
                    className="bg-red-100 text-red-800 hover:bg-red-100"
                >
                    {row.original.updates}
                </Badge>
            )
        },
        {
            accessorKey: 'roDue',
            header: 'RO Due',
            cell: ({ row }) => <span>${row.original.roDue.toFixed(2)}</span>
        },
        {
            accessorKey: 'roComp',
            header: 'RO Comp',
            cell: ({ row }) => <span>{row.original.roComp}</span>
        },
        {
            accessorKey: 'adjuster',
            header: 'Adjuster',
            cell: ({ row }) => (
                <UserAvatarCell 
                    name={row.original.adjuster.name}
                    avatarUrl={row.original.adjuster.avatarUrl}
                />
            )
        },
        {
            accessorKey: 'lastCommDate',
            header: 'Last Comm Date',
            cell: ({ row }) => <FriendlyDateCell date={row.original.lastCommDate} />
        },
        {
            id: 'summary',
            header: 'Summary',
            cell: ({ row }) => <SummaryCell text={row.original.summary} />
        },
        {
            id: 'communication',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <ContactMethodCell 
                        email=""
                        phone=""
                        messages="Click to view communication history"
                    />
                </div>
            )
        }
    ]

    return (
        <div className="w-full px-5">
            <DataTable
                columns={columns}
                data={mockInsurances}
                pageSize={10}
                pageSizeOptions={[5, 10, 20, 30, 40, 50]}
                showPageSize={true}
            />
        </div>
    )
}
