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
    ordersWithPartsToBeReceived,
    isLoading,
    error
  } = useGetTenantPartOrders({ tenantId: session?.user?.tenantId || '' });

  const data = ordersWithPartsToBeReceived;

  // Find a workfile by RO number
  const findWorkfileByRoNumber = (roNumber: string) => {
    // return workfiles.find(workfile => workfile.roNumber === roNumber) || workfiles[0];
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

  // Mock object for DataTable columns
  const mockData: PartsReceived[] = [
    {
      receivedId: '1',
      roNumber: 'RO12345',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        imageUrl: 'https://via.placeholder.com/100x60.png?text=Toyota+Camry',
      },
      partsCount: 3,
      assignedTech: 'John Doe',
      status: 'Received',
      lastUpdated: '2025-04-20T14:32:00Z',
      receivedDate: '2025-04-19T10:00:00Z',
      receivedBy: 'Jane Smith',
      vendor: 'OEM Parts Inc.',
      opportunityId: 'oppty-1',
    },
    {
      receivedId: '2',
      roNumber: 'RO67890',
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        imageUrl: 'https://via.placeholder.com/100x60.png?text=Honda+Civic',
      },
      partsCount: 5,
      assignedTech: 'Alice Johnson',
      status: 'Received',
      lastUpdated: '2025-04-21T09:15:00Z',
      receivedDate: '2025-04-20T16:30:00Z',
      receivedBy: 'Bob Lee',
      vendor: 'Aftermarket World',
      opportunityId: 'oppty-2',
    }
  ];

  return (
    <div>
      <DataTable columns={columns} data={mockData} />
    </div>
  )
}
