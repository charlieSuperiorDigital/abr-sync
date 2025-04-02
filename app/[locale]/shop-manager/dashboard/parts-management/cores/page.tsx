// This file represents the cores route
'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { coresMockData } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { workfiles } from '@/app/mocks/workfiles_new'

interface PartsCores {
  coreId: string
  roNumber: string
  vehicle: {
    make: string
    model: string
    year: number
    imageUrl?: string
  }
  description: string
  price: number
  updates: string
  lastUpdated: string
}

export default function Cores() {
  const [data] = useState<PartsCores[]>(coresMockData)

  // Find a workfile by RO number
  const findWorkfileByRoNumber = (roNumber: string) => {
    return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
  }

  const columns: ColumnDef<PartsCores, any>[] = [
    {
      accessorKey: 'updates',
      header: 'UPDATES',
      cell: ({ row }) => {
        const updates = row.original.updates
        let variant: 'success' | 'warning' | 'danger' | 'info' = 'info'
        
        switch (updates) {
          case 'NEW':
            variant = 'info'
            break
          case 'PENDING':
            variant = 'warning'
            break
          case 'URGENT':
            variant = 'danger'
            break
          case 'PROCESSED':
            variant = 'success'
            break
          default:
            variant = 'info'
        }
        
        return <StatusBadgeCell status={updates} variant={variant} />
      },
    },
    {
      accessorKey: 'roNumber',
      header: 'RO',
    },
    {
      accessorKey: 'vehicle',
      header: 'VEHICLE',
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
      accessorKey: 'description',
      header: 'DESCRIPTION',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.description}</span>
      ),
    },
    {
      accessorKey: 'price',
      header: 'PRICE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.price)}
        </span>
      ),
    },
    {
      accessorKey: 'viewParts',
      header: 'VIEW PARTS',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ViewPartsModal workfile={findWorkfileByRoNumber(row.original.roNumber)}>
            <DarkButton 
              buttonText="View Parts" 
            />
          </ViewPartsModal>
        </div>
      ),
    },
    {
      id: 'task',
      header: '',
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
                id: row.original.coreId,
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
