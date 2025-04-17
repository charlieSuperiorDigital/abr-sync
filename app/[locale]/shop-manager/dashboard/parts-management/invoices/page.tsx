'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { invoicesMockData } from '@/app/mocks/parts-management'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'

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
          year={String(row.original.vehicle.year)}
          imageUrl={row.original.vehicle.imageUrl}
        />
      ),
    },
    {
      accessorKey: 'partsCount',
      header: 'Parts Count',
    },
    {
      accessorKey: 'estimate',
      header: 'ESTIMATE',
    },
    {
      accessorKey: 'approvalStatus',
      header: 'STATUS',
      cell: ({ row }) => (
        <StatusBadgeCell
          status={row.original.approvalStatus.toUpperCase()}
          variant={row.original.approvalStatus === 'approved' ? 'success' : row.original.approvalStatus === 'rejected' ? 'danger' : 'warning'}
        />
      ),
    },
    {
      accessorKey: 'printCheck',
      header: '',
      cell: ({ row }) => (
       <DarkButton buttonText="Print Check" onClick={() => { console.log('print check') }} />
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
                id: row.original.invoiceId,
                type: 'workfile'
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
