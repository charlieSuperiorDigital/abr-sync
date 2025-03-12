'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { archiveMock, IArchive } from './mock/mock-data'
import { ColumnDef } from '@tanstack/react-table'
import {
  ArchiveButtonCell,
  DocumentCell,
  SummaryCell,
  UserAvatarCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'

export default function Archive() {
  const columns: ColumnDef<IArchive>[] = [
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
          imageUrl={row.original.vehicle.image}
        />
      ),
    },
    {
      accessorKey: 'roNumber',
      header: 'RO #',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roNumber}</span>
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
      accessorKey: 'firstCall',
      header: 'First Call',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.firstCall}</span>
      ),
    },
    {
      accessorKey: 'secondCall',
      header: 'Second Call',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.secondCall}</span>
      ),
    },

    {
      accessorKey: 'lastUpdatedBy',
      header: 'Last Updated By',
      cell: ({ row }) => (
        <UserAvatarCell
          name={row.original.lastUpdatedBy.name}
          avatarUrl={row.original.lastUpdatedBy.avatar}
        />
      ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.lastUpdated}</span>
      ),
    },
    {
      id: 'timeTracking',
      header: 'timeTracking',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.lastUpdated}</span>
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
        <ArchiveButtonCell
          archive={false}
          onClick={() => console.log('Archive clicked')}
        />
      ),
    },
  ]
  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={archiveMock}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
