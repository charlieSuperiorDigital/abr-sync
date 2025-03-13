'use client'

import { ColumnDef } from '@tanstack/react-table'
import { IEstimate, mockEstimate } from './mock/mock-data'
import {
  AutoCell,
  ContactMethodCell,
  DocumentCell,
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { PanelTop } from 'lucide-react'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { opportunities } from '@/app/mocks/opportunities_new'
import { Opportunity } from '@/app/types/opportunity'

export default function Estimate() {
  const columns: ColumnDef<IEstimate>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO#',
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
      accessorKey: 'estimateUrl',
      header: 'File',
      cell: ({ row }) => <DocumentCell fileName={row.original.estimateUrl} />,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.owner}</span>
      ),
    },

    {
      accessorKey: 'partsCount',
      header: 'Parts',
      cell: ({ row }) => (
        <>
          <span className="whitespace-nowrap">{row.original.partsCount}</span>
          {row.original.partsStatus && (
            <StatusBadgeCell status={row.original.partsStatus} />
          )}
        </>
      ),
    },
    {
      accessorKey: 'inRental',
      header: 'In Rental',
      cell: ({ row }) => (row.original.inRental ? <AutoCell /> : null),
    },
    {
      id: 'priority',
      header: 'Priority',
      cell: ({ row }) => {
        const priority = row.original.priority
        const variantMap: {
          [key: string]: 'forest' | 'danger' | 'warning' | undefined
        } = {
          NORMAL: 'forest',
          HIGH: 'warning',
        }
        const variant = variantMap[priority] || undefined

        return (
          priority && <StatusBadgeCell status={priority} variant={variant} />
        )
      },
    },
    {
      id: 'warning',
      header: 'warning',
      cell: ({ row }) =>
        row.original.warning.message ? (
          <StatusBadgeCell
            status={row.original.warning.message}
            variant="warning"
          />
        ) : null,
    },
    {
      id: 'insuranceApproval',
      header: 'Insurance Approval',
      cell: ({ row }) => {
        const variantMap: {
          [key: string]: 'forest' | 'danger' | 'warning' | undefined
        } = {
          'PENDING APPROVAL': 'warning',
          APPROVED: 'forest',
        }
        const variant = variantMap[row.original.insuranceApproval] || undefined
        return row.original.insuranceApproval ? (
          <StatusBadgeCell
            status={row.original.insuranceApproval}
            variant={variant}
          />
        ) : null
      },
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

  // Transform Opportunity data to match IEstimate interface
  const estimateData: IEstimate[] = opportunities
    .filter(opp => opp.status === "Estimate")
    .map(opp => ({
      roNumber: '---', // Not available in Opportunity type
      vehicle: {
        id: opp.vehicle.vin, // Using VIN as ID
        make: opp.vehicle.make,
        model: opp.vehicle.model,
        year: opp.vehicle.year,
        imageUrl: `https://picsum.photos/seed/${opp.opportunityId}/200/100`,
      },
      estimateUrl: '/estimates/pending.pdf', // Placeholder
      owner: opp.customer.name,
      partsCount: 0, // Not available in Opportunity type
      partsStatus: null, // Not available in Opportunity type
      inRental: opp.isInRental || false,
      priority: opp.priority === 'High' ? 'HIGH' : 'NORMAL', // Convert to match IEstimate format
      warning: {
        message: '',
        type: null,
      },
      insuranceApproval: 'PENDING APPROVAL', // Default since not available in Opportunity
      hasPreferredContact: false, // Not available in Opportunity type
      email: opp.customer.email,
      phone: opp.customer.phone,
      messages: '', // Not available in Opportunity type
    }))

  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={estimateData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
