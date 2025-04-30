// This file represents the received route
'use client'

import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  StatusBadgeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'
import { useState } from 'react'
import { useGetTenantPartOrders } from '@/app/api/hooks/useParts';
import { useSession } from 'next-auth/react';
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { Plus } from 'lucide-react'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { TenantPartOrder, PartsOrderSummary } from '@/app/types/parts'

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
  opportunityId: string
}

export default function Received() {
  const { data: session } = useSession();
  const {
    getMostRecentReceivedDate,
    ordersWithReceivedParts,
    isLoading,
    error
  } = useGetTenantPartOrders({ tenantId: session?.user?.tenantId || '' });

  const data = ordersWithReceivedParts;



  const columns: ColumnDef<TenantPartOrder, any>[] = [
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
          imageUrl={'https://via.placeholder.com/150'}
        />
      ),
    },
    {
      accessorKey: 'receivedDate',
      header: 'RECEIVED',
      cell: ({ row }) => {
        const receivedDate = getMostRecentReceivedDate(row.original);
        return (
          <span className="whitespace-nowrap">
            {receivedDate ? new Date(receivedDate).toLocaleDateString() : 'Not received'}
          </span>
        );
      },
    },
    {
      accessorKey: 'assignedTech',
      header: 'PARTS MANAGER',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.assignedTech ? row.original.assignedTech.name : 'No Tech Assigned'}
        </span>
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
          <ViewPartsModal opportunityId={row.original.opportunityId}>
            <DarkButton
              buttonText="View Parts"
            />
          </ViewPartsModal>
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
                id: row.original.opportunityId,
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
