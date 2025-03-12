'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ITotalLoss, mockTotalLoss } from './mock/mock-data'
import { ColumnDef } from '@tanstack/react-table'
import {
  ContactMethodCell,
  DocumentCell,
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { PanelTop } from 'lucide-react'

export default function TotalLoss() {
  const columns: ColumnDef<ITotalLoss>[] = [
    {
      accessorKey: 'claim',
      header: 'Claim',
    },
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
      accessorKey: 'customer',
      header: 'Customer',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.customer}</span>
      ),
    },

    {
      accessorKey: 'insurance',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.insurance}</span>
      ),
    },

    {
      accessorKey: 'nroCommunication',
      header: '# Of Communications',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.nroCommunication}
        </span>
      ),
    },
    {
      accessorKey: 'timeTracking',
      header: 'Time Tracking',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.timeTracking}</span>
      ),
    },
    {
      id: 'finalBill',
      header: 'Final Bill',
      cell: ({ row }) => (
        <DocumentCell
          fileName={row.original.finalBill.fileName}
          onClick={() => console.log('click doc')}
        />
      ),
    },
    {
      id: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => <SummaryCell />,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <ContactMethodCell
          email={row.original.email}
          phone={row.original.phone}
          messages={row.original.messages}
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
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={mockTotalLoss}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
