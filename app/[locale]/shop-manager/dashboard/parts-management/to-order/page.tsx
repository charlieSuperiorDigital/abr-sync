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
import DarkButton from '@/app/[locale]/custom-components/dark-button'

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
      accessorKey: 'updates',
      header: 'UPDATES',
    },
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
      accessorKey: 'toOrder',
      header: 'TO ORDER',
    },
    {
      accessorKey: 'toReceive',
      header: 'TO RECEIVE',
    },
    {
      accessorKey: 'total',
      header: 'TOTAL',
    },
    {
      accessorKey: 'assignedTech',
      header: 'Assigned Tech',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.assignedTech}</span>
      ),
    },
    {
      accessorKey: 'estimate',
      header: 'ESTIMATE',
    },
    {
      accessorKey: 'ecd',
      header: 'ECD',
    },
    {
      accessorKey: 'viewParts',
      header: 'VIEW PARTS',
      cell: ({ row }) => (
        <DarkButton buttonText="View Parts" onClick={() => {console.log('view parts')}} />
      ),
    },
   
  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
