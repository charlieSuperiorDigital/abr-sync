'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { IArchive } from './mock/mock-data'
import {
  StatusBadgeCell,
  UserAvatarCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { PanelTop } from 'lucide-react'
import { opportunities } from '@/app/mocks/opportunities_new'

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
      header: 'Ro#',
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
          avatarUrl={row.original.lastUpdatedBy.avatar}
          name={row.original.lastUpdatedBy.name}
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
      accessorKey: 'timeTracking',
      header: 'Time Tracking',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.timeTracking}</span>
      ),
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        row.original.priority && (
          <StatusBadgeCell
            status="High"
            variant="warning"
          />
        )
      ),
    },
    {
      id: 'task',
      header: '',
      cell: ({ row }) => <PanelTop size={18} />,
    },
  ]

  // Transform Opportunity data to match IArchive interface
  const archiveData: IArchive[] = opportunities
    .filter(opp => opp.status === "Archived")
    .map(opp => ({
      id: opp.opportunityId,
      claim: opp.insurance.claimNumber,
      vehicle: {
        image: `https://picsum.photos/seed/${opp.opportunityId}/200/100`,
        year: opp.vehicle.year,
        make: opp.vehicle.make,
        model: opp.vehicle.model,
      },
      roNumber: '---', // Not available in Opportunity type
      customer: opp.customer.name,
      firstCall: new Date(opp.createdDate).toLocaleDateString(), // Using createdDate as first call
      secondCall: new Date(opp.lastUpdatedDate).toLocaleDateString(), // Using lastUpdatedDate as second call
      lastUpdatedBy: {
        name: 'System', // Not available in Opportunity type
        avatar: '/placeholder.svg?height=24&width=24',
      },
      lastUpdated: new Date(opp.lastUpdatedDate).toLocaleDateString(),
      timeTracking: '---', // Not available in Opportunity type
      priority: opp.priority === 'High', // Convert string priority to boolean
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={archiveData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
