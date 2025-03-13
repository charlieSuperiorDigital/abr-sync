'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { ITotalLoss } from './mock/mock-data'
import {
  ContactMethodCell,
  DocumentCell,
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { PanelTop } from 'lucide-react'
import { opportunities } from '@/app/mocks/opportunities_new'

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
        <span className={`whitespace-nowrap font-bold ${row.original.insurance === 'Progressive' ? 'text-blue-700' : ''}`}>
          {row.original.insurance.toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: 'nroCommunication',
      header: 'Communication',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.nroCommunication}</span>
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
      accessorKey: 'finalBill',
      header: 'Final Bill',
      cell: ({ row }) => (
        <DocumentCell fileName={row.original.finalBill.fileName} />
      ),
    },
    {
      accessorKey: 'isPickedUp',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.isPickedUp ? 'Picked Up' : 'Pending'}
          variant={row.original.isPickedUp ? 'forest' : 'warning'}
        />
      ),
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

  // Transform Opportunity data to match ITotalLoss interface
  const totalLossData: ITotalLoss[] = opportunities
    .filter(opp => opp.status === "Total Loss")
    .map(opp => ({
      id: opp.opportunityId,
      claim: opp.insurance.claimNumber,
      vehicle: {
        year: opp.vehicle.year,
        make: opp.vehicle.make,
        model: opp.vehicle.model,
        imageUrl: `https://picsum.photos/seed/${opp.opportunityId}/200/100`,
      },
      customer: opp.customer.name,
      insurance: opp.insurance.company,
      nroCommunication: 0, // Not available in Opportunity type
      communication: {
        hasEmail: !!opp.customer.email,
        hasPhone: !!opp.customer.phone,
        hasMessages: false,
        totalCommunications: 0,
      },
      timeTracking: '---', // Not available in Opportunity type
      finalBill: {
        fileName: 'FinalBill.pdf',
        url: '/documents/finalbill.pdf',
      },
      isPickedUp: false, // Not available in Opportunity type
      hasDocument: false, // Not available in Opportunity type
      email: opp.customer.email,
      phone: opp.customer.phone,
      messages: '', // Not available in Opportunity type
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={totalLossData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
