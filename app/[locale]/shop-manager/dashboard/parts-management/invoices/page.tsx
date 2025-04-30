// This file represents the invoices route
'use client'

import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { ViewPartsModal } from '@/app/[locale]/custom-components/view-parts-modal'
import { useGetTenantPartOrders } from '@/app/api/hooks/useParts'
import { TenantPartOrder } from '@/app/types/parts'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
    VehicleCell
} from '@/components/custom-components/custom-table/table-cells'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'


export default function Invoices() {
    const { data: session } = useSession();
    const {
        ordersWhichExceedAmountSpecifiedByTenant,
        calculateOrderTotalParts,
        calculateOrderTotalAmount,
        isLoading,
        error,
        
    } = useGetTenantPartOrders({ tenantId: session?.user?.tenantId || '' });

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
            accessorKey: 'totalPartsCount',
            header: 'NUMBER OF PARTS',
            cell: ({ row }) => {
                return calculateOrderTotalParts(row.original);
            },
        },

        {
            accessorKey: 'amount',
            header: '$ AMOUNT',
            cell: ({ row }) => {
                const amount = calculateOrderTotalAmount(row.original);
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(amount);
            },
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => (
                <span className="whitespace-nowrap">
                    {"PLACEHOLDER"}
                </span>
            ),
        },
       
        {
            accessorKey: 'viewParts',
            header: 'VIEW PARTS',
            cell: ({ row }) => (
                <div className="flex justify-center">
                  
                        <DarkButton
                            buttonText="Print Check"
                        />
                  
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

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    return (
        <div>
            <DataTable columns={columns} data={ordersWhichExceedAmountSpecifiedByTenant} />
        </div>
    )
}