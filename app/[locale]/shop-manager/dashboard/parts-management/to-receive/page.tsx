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
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'

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
      accessorKey: 'toReceive',
      header: 'TO RECEIVE',
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
      accessorKey: 'ordered',
      header: 'ORDERED',
    },
    {
      accessorKey: 'partsManager',
      header: 'PARS MANAGER',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.assignedTech}</span>
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
      accessorKey: 'estimate',
      header: 'ESTIMATE',
    },
    {
      accessorKey: 'ecd',
      header: 'ECD',
    },
    {
      accessorKey: 'expectedDeliveryDate',
      header: 'EXPECTED',
    },
    {
      accessorKey: 'viewParts',
      header: 'VIEW PARTS',
      cell: ({ row }) => (
        <DarkButton buttonText="View Parts" onClick={() => { console.log('view parts') }} />
      ),
    },
    {
      id: 'task',
      header: 'Task',
      cell: ({ row }) => (
        <div
        onClick={(e) => {
          e.stopPropagation()
        }}
        >

          <NewTaskModal
            title="New Task"
            defaultRelation={
              {
                id: row.original.orderId,
                type: 'opportunity'
              }
            }
            children={
              <Plus className="m-auto w-5 h-5" />
            }
          />
        </div>
      ),
    },




  ]

  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
