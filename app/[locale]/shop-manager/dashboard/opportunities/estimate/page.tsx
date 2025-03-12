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
  return (
    <div className="flex flex-col min-h-screen">
      <DataTable
        columns={columns}
        data={mockEstimate}
        onRowClick={(row) => console.log('Row clicked:', row)}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
        showPageSize={true}
      />
    </div>
  )
}
