'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { invoicesMockData } from '@/app/mocks/parts-management'

interface PartsInvoice {
  invoiceId: string
  roNumber: string
  vehicle: {
    make: string
    model: string
    year: number
    imageUrl?: string
  }
  partsCount: number
  assignedTech: string
  status: string
  lastUpdated: string
  invoiceNumber: string
  amount: number
  approvalStatus: 'pending' | 'approved' | 'rejected'
}

export default function Invoices() {
  const [data] = useState<PartsInvoice[]>(invoicesMockData)

  const columns: ColumnDef<PartsInvoice, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO #',
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
      accessorKey: 'partsCount',
      header: 'Parts Count',
    },
    {
      accessorKey: 'assignedTech',
      header: 'Assigned Tech',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.assignedTech}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <StatusBadgeCell status={row.original.status} />
      ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'Last Updated',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.lastUpdated).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice #',
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: 'approvalStatus',
      header: 'Approval Status',
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.approvalStatus.toUpperCase()}
          variant={row.original.approvalStatus === 'approved' ? 'success' : row.original.approvalStatus === 'rejected' ? 'danger' : 'warning'}
        />
      ),
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
