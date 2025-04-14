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
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { useSession } from 'next-auth/react'
import { useGetTenantPartOrders } from '@/app/api/hooks/useGetTenantPartOrders'
import { WorkfileStatus } from '@/app/types/workfile'
import { Tech, PartsOrderSummary } from '@/app/api/functions/parts'
import { formatCurrency } from '@/app/utils/currency-utils'
import { formatDate } from '@/app/utils/date-utils'
import { TenantPartOrder } from '@/app/api/functions/parts'

// interface PartsReceive {
//   opportunityId: string;
//   roNumber: string;
//   vehicle: {
//     make: string;
//     model: string;
//     year: string;
//     vin: string;
//   };
//   estimateAmount: number;
//   estimatedCompletionDate: string;
//   assignedTech: string | Tech;
//   partsOrders: PartsOrderSummary[];
//   partsCount: number;
//   status: WorkfileStatus;
//   lastUpdated: string;
//   trackingNumber: string;
//   partsManager: string | Tech;
// }

export default function ToReceive() {
  const { data: session } = useSession();
  const { ordersWithPartsToBeReceived: data, isLoading, calculateOrderToOrderParts, calculateOrderToReceiveParts, calculateOrderTotalParts } = useGetTenantPartOrders({
    tenantId: session?.user?.tenantId || ''
  });

  if (isLoading) return <div>Loading...</div>;

  // Transform data to match PartsReceive interface
  // const transformedData = data?.map((order: TenantPartOrder) => ({
  //   ...order,
  //   partsCount: order.partsOrders.reduce((sum, order) => sum + order.partsToOrderCount, 0),
  //   assignedTech: order.assignedTech,
  //   estimateAmount: order.estimateAmount,
  //   estimatedCompletionDate: order.estimatedCompletionDate,
    
  //   status: 'To Receive' as WorkfileStatus,
  //   lastUpdated: order.partsOrders
  //     .map(order => order.lastCommunicationDate)
  //     .filter(date => date) // Remove any null/undefined dates
  //     .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort newest first
  //     .shift() || new Date().toISOString(), // Take the newest date or use current time if none
  //   trackingNumber: '', // No tracking number in the source data
  //   partsManager: order.assignedTech // No parts manager in the source data
  // })) || [];

  const columns: ColumnDef<TenantPartOrder, any>[] = [
    // {
    //   id: 'updates',
    //   accessorKey: 'updates',
    //   header: 'UPDATES',
    // },
    {
      id: 'roNumber',
      accessorKey: 'roNumber',
      header: 'RO #',
    },
    {
      id: 'vehicle',
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
        />
      ),
    },
    // {
    //   id: 'ordered',
    //   accessorKey: 'ordered',
    //   header: 'ORDERED',
    // },
    {
      id: 'assignedTech',
      accessorKey: 'assignedTech',
      header: 'ASSIGNED TECH',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.assignedTech.name ?? '---'}
        </span>
      ),
    },
    {
      id: 'toOrder',
      accessorKey: 'toOrder',
      header: 'TO ORDER',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {calculateOrderToOrderParts(row.original)}
        </span>
      ),
    },
    {
      id: 'toReceive',
      accessorKey: 'toReceive',
      header: 'TO RECEIVE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {calculateOrderToReceiveParts(row.original)}
        </span>
      ),
    },
    {
      id: 'total',
      accessorKey: 'total',
      header: 'TOTAL',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {calculateOrderTotalParts(row.original)}
        </span>
      ),
    },
    {
      id: 'estimate',
      accessorKey: 'estimateAmount',
      header: 'ESTIMATE',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatCurrency(row.original.estimateAmount)}</span>
      ),
    },
    {
      id: 'ecd',
      accessorKey: 'estimatedCompletionDate',
      header: 'ECD',
      cell: ({ row }) => (
        
        <span className="whitespace-nowrap">
          {formatDate(row.original.estimatedCompletionDate)}
        </span>
      ),
    },
    {
      id: 'expectedDeliveryDate',
      accessorKey: 'expectedDeliveryDate',
      header: 'EXPECTED',
    },
    {
      id: 'viewParts',
      accessorKey: 'viewParts',
      header: 'VIEW PARTS',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <ViewPartsModal partOrder={row.original}>
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
            defaultRelation={{
              id: row.original.opportunityId,
              type: 'opportunity'
            }}
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
      <DataTable columns={columns} data={transformedData} />
    </div>
  )
}
