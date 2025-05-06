// src/app/[locale]/components/total-loss-opportunities/totalLossColumns.tsx

import DarkButton from '@/app/[locale]/custom-components/dark-button'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { OpportunityResponse } from '@/app/types/opportunities'
import {
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Car, Plus } from 'lucide-react'
import React from 'react' // Necesario para JSX

// Define el tipo para las props que recibirá la función de columnas
export interface GetTotalLossColumnsProps {
  handlePickupClick: (opportunity: OpportunityResponse) => void
  // formatDate is not used in these specific columns, so no need to pass it
}

export function getTotalLossColumns({
  handlePickupClick,
}: GetTotalLossColumnsProps): ColumnDef<OpportunityResponse>[] {
  return [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicleMake}
          model={row.original.vehicleModel}
          year={String(row.original.vehicleYear)}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'ownerName',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.ownerFirstName} {row.original.ownerLastName}</span>
      ),
    },
    {
      accessorKey: 'insuranceName',
      header: 'Insurance',
      cell: ({ row }) => (
        <span
          className={`whitespace-nowrap font-bold ${row.original.insuranceName === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}
        >
          {row.original.insuranceName.toUpperCase()}
        </span>
      ),
    },
    // {
    //   accessorKey: 'numberOfCommunications',
    //   header: '# OF COMMUNICATIONS',
    //   cell: ({ row }) => {
    //     const communicationLogs =
    //       row.original.logs?.filter(
    //         (log) =>
    //           log.type.toLowerCase().includes('call') ||
    //           log.type.toLowerCase().includes('email') ||
    //           log.type.toLowerCase().includes('message')
    //       ) || []

    //     return (
    //       <span className="whitespace-nowrap">{communicationLogs.length}</span>
    //     )
    //   },
    // },
    {
      accessorKey: 'timeTracking',
      header: 'Time Tracking',
      // If timeTracking needs specific formatting or logic,
      // you might need to pass a formatting function here too.
      // For now, assuming it's a simple display field.
    },
    // {
    //   accessorKey: 'finalBill',
    //   header: 'Final Bill',
    //   cell: ({ row }) => {
    //     const amount = row.original.finalBill?.amount
    //     return (
    //       <span className="whitespace-nowrap">
    //         {amount
    //           ? new Intl.NumberFormat('en-US', {
    //               style: 'currency',
    //               currency: 'USD',
    //             }).format(amount)
    //           : '---'}
    //       </span>
    //     )
    //   },
    // },
    {
      header: 'Summary',
      cell: ({ row }) => (
        <SummaryCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
      ),
    },
    {
      id: 'pickup',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Mark as Picked Up"
            buttonIcon={<Car className="mr-2 w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation()
              handlePickupClick(row.original)
            }}
          />
        </div>
      ),
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div
          data-testid="contact-info"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation() // Prevent row click
            console.log(
              'Contact clicked for opportunity:',
              row.original.opportunityId
            )
          }}
        >
          {/* Assuming ContactInfo component doesn't need opportunity data directly */}
          <ContactInfo />
        </div>
      ),
    },
    {
      id: 'task',
      header: 'Task',
      cell: ({ row }) => (
        <div
          onClick={(e) => {
            e.stopPropagation() // Prevent row click
          }}
        >
          <NewTaskModal
            title="New Task"
            defaultRelation={{
              id: row.original.opportunityId,
              type: 'opportunity',
            }}
            children={<Plus className="m-auto w-5 h-5" />}
          />
        </div>
      ),
    },
  ]
}
