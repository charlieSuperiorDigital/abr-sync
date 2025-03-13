'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ISecondCall, mockSecondCall } from './mock/mock-data'
import {
  ArchiveButtonCell,
  SummaryCell,
  UserAvatarCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { PanelTop } from 'lucide-react'
import { opportunities } from '@/app/mocks/opportunities_new'

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
      id: 'summary',
      header: '',
      cell: ({ row }) => <SummaryCell />,
    },
    {
      accessorKey: 'archive',
      header: '',
      cell: ({ row }) => (
        <ArchiveButtonCell
          archive={row.original.archive}
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

  // Transform Opportunity data to match ISecondCall interface
  const secondCallData: ISecondCall[] = opportunities
    .filter(opp => opp.status === "2nd Call")
    .map(opp => ({
      id: opp.opportunityId,
      claim: opp.insurance.claimNumber,
      vehicle: {
        year: opp.vehicle.year,
        make: opp.vehicle.make,
        model: opp.vehicle.model,
        imageUrl: `https://picsum.photos/seed/${opp.opportunityId}/200/100`,
      },
      roNumber: '---', // Not available in Opportunity type
      customer: opp.customer.name,
      firstCall: new Date(opp.createdDate).toLocaleDateString(), // Using createdDate as first call
      secondCall: new Date(opp.lastUpdatedDate).toLocaleDateString(), // Using lastUpdatedDate as second call
      lastUpdatedBy: {
        id: '1',
        name: 'System', // Not available in Opportunity type
        avatarUrl: '/placeholder.svg',
      },
      lastUpdated: new Date(opp.lastUpdatedDate).toLocaleDateString(),
      timeTracking: '---', // Not available in Opportunity type
      hasDocument: false, // Not available in Opportunity type
      archive: false,
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={secondCallData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
