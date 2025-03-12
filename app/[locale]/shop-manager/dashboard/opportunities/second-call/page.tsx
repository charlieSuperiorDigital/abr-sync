'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ISecondCall, mockSecondCall } from './mock/mock-data'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArchiveButtonCell,
  SummaryCell,
  UserAvatarCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { PanelTop } from 'lucide-react'

export default function SecondCall() {
  const columns: ColumnDef<ISecondCall>[] = [
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
      accessorKey: 'ro',
      header: 'Ro#',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roNumber}</span>
      ),
    },

    {
      accessorKey: 'lastUpdated',
      header: 'last Updated',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.lastUpdated}</span>
      ),
    },

    {
      accessorKey: 'lastUpdatedBy',
      header: 'Last Updated By',
      cell: ({ row }) => (
        <UserAvatarCell
          avatarUrl={row.original.lastUpdatedBy.avatarUrl}
          name={row.original.lastUpdatedBy.name}
        />
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
      id: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => <SummaryCell />,
    },

    {
      accessorKey: 'archive',
      header: '',
      cell: ({ row }) => (
        <ArchiveButtonCell
          archive={true}
          onClick={() => console.log('click archive')}
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
        data={mockSecondCall}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
