// This file represents the to-order route

'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { toOrderMockData } from '@/app/mocks/parts-management'

interface PartsOrder {
  orderId: string
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
  neededByDate: string
  vendor: string
  priority: 'high' | 'medium' | 'low'
}

export default function ToOrder() {
  const [data] = useState<PartsOrder[]>(toOrderMockData)

  const columns: ColumnDef<PartsOrder, any>[] = [
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
      accessorKey: 'neededByDate',
      header: 'Needed By Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.neededByDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor',
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.priority === 'high' ? 'danger' : row.original.priority === 'medium' ? 'warning' : 'success'}
          size="sm"
        >
          {row.original.priority.toUpperCase()}
        </StatusBadge>
      ),
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
