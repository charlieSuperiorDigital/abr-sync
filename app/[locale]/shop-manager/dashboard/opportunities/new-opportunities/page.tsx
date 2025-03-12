'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { mockVehicles, NewOpportunites } from './mock/mock-data'
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

export default function NewOpportunities() {
  const columns: ColumnDef<NewOpportunites>[] = [
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={row.original.vehicle.imageUrl}
        />
      ),
    },
    {
      accessorKey: 'claim',
      header: 'Claim',
    },
    {
      accessorKey: 'insurance',
      header: 'Insurance',
      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}
        >
          {row.original.insurance.company}
        </span>
      ),
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
    },
    {
      accessorKey: 'inRental',
      header: 'In Rental',
      cell: ({ row }) => (row.original.inRental ? <AutoCell /> : null),
    },
    {
      accessorKey: 'dropDate',
      header: 'Drop Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.dropDate}</span>
      ),
    },
    {
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) =>
        row.original.warning ? (
          <StatusBadgeCell
            variant="danger"
            status={row.original.warning.type}
          />
        ) : null,
    },
    {
      id: 'uploadDeadline',
      header: 'Upload Deadline',
      cell: ({ row }) => (
        <UploadTimeCell deadline={row.original.uploadDeadline} />
      ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Communication',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.lastCommDate}</span>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ContactMethodCell
          email={row.original.email}
          phone={row.original.phone}
          messages={row.original.message}
        />
      ),
    },
    {
      id: 'task',
      header: '',
      cell: ({ row }) => <PanelTop size={18} />,
    },
  ]
  return (
    <div className="w-full">
      <DataTable
        columns={columns}
        data={mockVehicles}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
