// This file represents the received route
'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { receivedMockData } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { workfiles } from '@/app/mocks/workfiles_new'

interface PartsReceived {
  receivedId: string
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
  receivedDate: string
  receivedBy: string
  vendor: string
}

export default function Received() {
  const [data] = useState<PartsReceived[]>(receivedMockData)

  // Find a workfile by RO number
  const findWorkfileByRoNumber = (roNumber: string) => {
    return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
  }

  const columns: ColumnDef<PartsReceived, any>[] = [
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
          year={String(row.original.vehicle.year)}
          imageUrl={row.original.vehicle.imageUrl}
        />
      ),
    },
    {
      accessorKey: 'receivedDate',
      header: 'RECEIVED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.receivedDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'assignedTech',
      header: 'PARTS MANAGER',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.assignedTech}</span>
      ),
    },
    {
      accessorKey: 'estimator',
      header: 'ESTIMATOR',

    },
    {
      accessorKey: 'partsCount',
      header: 'Parts Count',
    },
    {
      accessorKey: 'estimate',
      header: 'ESTIMATE'
    },
    {
      accessorKey: 'ecd',
      header: 'ECD',
    },
    {
      accessorKey: 'vendor',
      header: 'Vendor',
    },
    {
      accessorKey: 'viewParts',
      header: 'VIEW PARTS',
      cell: ({ row }) => (
        <div className="flex justify-center">
          {/* <ViewPartsModal 
            workfile={findWorkfileByRoNumber(row.original.roNumber)}
          >
            <DarkButton 
              buttonText="View Parts" 
            />
          </ViewPartsModal> */}
        </div>
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
                id: row.original.receivedId,
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
