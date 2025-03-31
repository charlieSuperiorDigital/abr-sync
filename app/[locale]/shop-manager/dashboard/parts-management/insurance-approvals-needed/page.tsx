// This file represents the insurance-approvals-needed route
'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { invoicesMockData } from '@/app/mocks/parts-management'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'

interface PartsInsuranceApproval {
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
  estimator?: string
  toReceive?: number
  total?: number
  ecd?: string
  expected?: string
}

export default function InsuranceApprovalsNeeded() {
  const [data] = useState<PartsInsuranceApproval[]>(invoicesMockData)

  const columns: ColumnDef<PartsInsuranceApproval, any>[] = [
    {
      accessorKey: 'roNumber',
      header: 'RO #',
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
      accessorKey: 'amount',
      header: 'AMOUNT',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.original.amount)}
        </span>
      ),
    },
    {
      accessorKey: 'approvalStatus',
      header: 'INSURANCE APPROVAL STATUS',
      cell: ({ row }) => (
        <StatusBadgeCell
          variant={
            row.original.approvalStatus === 'approved'
              ? 'success'
              : row.original.approvalStatus === 'rejected'
              ? 'danger'
              : 'warning'
          }
          status={row.original.approvalStatus.toUpperCase()}
        />
      ),
    },
    {
      accessorKey: 'lastUpdated',
      header: 'ORDERED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {new Date(row.original.lastUpdated).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: 'estimator',
      header: 'ESTIMATOR',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.estimator || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'toReceive',
      header: 'TO RECEIVE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.toReceive || 0}</span>
      ),
    },
    {
      accessorKey: 'total',
      header: 'TOTAL',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.total || row.original.partsCount}</span>
      ),
    },
    {
      accessorKey: 'ecd',
      header: 'ECD',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.ecd || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'expected',
      header: 'EXPECTED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.expected || 'N/A'}</span>
      ),
    },
    {
      accessorKey: 'viewParts',
      header: '',
      cell: ({ row }) => (
        <DarkButton buttonText="View Parts" onClick={() => { console.log('view parts') }} />
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
                id: row.original.invoiceId,
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
