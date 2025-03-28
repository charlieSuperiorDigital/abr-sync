// This file represents the to-receive route
'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { toReceiveMockData } from '@/app/mocks/parts-management'

interface PartsReceive {
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
  expectedDeliveryDate: string
  trackingNumber: string
  partsManager: string
}

export default function ToReceive() {
  const [data] = useState<PartsReceive[]>(toReceiveMockData)

  const columns: ColumnDef<PartsReceive, any>[] = [
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
      accessorKey: 'expectedDeliveryDate',
      header: 'Expected Delivery Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.expectedDeliveryDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'trackingNumber',
      header: 'Tracking #',
    },
    {
      accessorKey: 'partsManager',
      header: 'Parts Manager',
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
