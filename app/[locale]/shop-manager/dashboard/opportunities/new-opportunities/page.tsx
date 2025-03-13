'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  AutoCell,
  ContactMethodCell,
  StatusBadgeCell,
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { MessageSquareMore, PanelTop } from 'lucide-react'
import { opportunities } from '@/app/mocks/opportunities_new'
import { Opportunity } from '@/app/types/opportunity'

export default function NewOpportunities() {
  const columns: ColumnDef<Opportunity>[] = [
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}>
          {row.original.insurance.company.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'customer.name',
      header: 'Owner',
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => (row.original.isInRental ? 'Yes' : 'No'),
    },
    {
      accessorKey: 'dropDate',
      header: 'Drop Date',
    },
    {
      accessorKey: 'lastUpdatedDate',
      header: 'Last Comm',
      cell: ({ row }) => <UploadTimeCell deadline={row.original.lastUpdatedDate} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadgeCell status={row.original.status} />,
    },
    {
      accessorKey: 'customer.email',
      header: 'Email',
      cell: ({ row }) => <ContactMethodCell email={row.original.customer.email} />,
    },
    {
      accessorKey: 'customer.phone',
      header: 'Phone',
      cell: ({ row }) => <ContactMethodCell phone={row.original.customer.phone} />,
    },
    {
      accessorKey: 'lastCommunicationSummary',
      header: 'Message',
      cell: ({ row }) => <MessageSquareMore size={18} />,
    },
    {
      accessorKey: 'vehicle',
      header: 'Summary',
      cell: () => <SummaryCell />,
    },
    {
      id: 'actions',
      cell: ({ row }) => <PanelTop size={18} />,
    },
  ]

  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={opportunities.filter(opp => opp.status === "New")}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />
    </div>
  )
}
