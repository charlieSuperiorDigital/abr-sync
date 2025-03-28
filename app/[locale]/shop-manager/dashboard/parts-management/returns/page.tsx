'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { returnsMockData } from '@/app/mocks/parts-management'

interface PartsReturn {
  returnId: string
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
  returnReason: string
  rmaNumber: string
  refundStatus: 'pending' | 'approved' | 'rejected' | 'completed'
}

export default function Returns() {
  const [data] = useState<PartsReturn[]>(returnsMockData)

  const columns: ColumnDef<PartsReturn, any>[] = [
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
      accessorKey: 'returnReason',
      header: 'Return Reason',
    },
    {
      accessorKey: 'rmaNumber',
      header: 'RMA #',
    },
    {
      accessorKey: 'refundStatus',
      header: 'Refund Status',
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.refundStatus.toUpperCase()}
          variant={
            row.original.refundStatus === 'completed' ? 'success' :
            row.original.refundStatus === 'rejected' ? 'danger' :
            row.original.refundStatus === 'approved' ? 'info' : 'warning'
          }
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
