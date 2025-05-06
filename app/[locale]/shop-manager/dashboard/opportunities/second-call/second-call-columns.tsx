import DarkButton from '@/app/[locale]/custom-components/dark-button'
import {  OpportunityResponse } from '@/app/types/opportunities'
import {
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { ColumnDef } from '@tanstack/react-table'
import { Archive, Plus } from 'lucide-react'

type GetSecondCallColumnsProps = {
  formatDate: (date: string | undefined) => string
  handleArchiveClick: (opportunity: OpportunityResponse) => void
}

export const getSecondCallColumns = ({
  formatDate,
  handleArchiveClick,
}: GetSecondCallColumnsProps): ColumnDef<OpportunityResponse, any>[] => {
  return [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'CLAIM',
    },
    {
      accessorKey: 'vehicle',
      header: 'VEHICLE',
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
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {row.original.roNumber || '---'} */}
          {"PLACEHOLDER"}
        </span>
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.ownerFirstName + " " + row.original.ownerLastName}</span>
      ),
    },
    {
      accessorKey: 'firstCallDate',
      header: '1ST CALL',
      cell: ({ row }) => (
        <span className="text-gray-600 whitespace-nowrap">
          {formatDate(row.original._1stCall)}
        </span>
      ),
    },
    {
      accessorKey: 'secondCallDate',
      header: '2ND CALL',
      cell: ({ row }) => (
        <span className="text-gray-600 whitespace-nowrap">
          {formatDate(row.original._2ndCall)}
        </span>
      ),
    },
    {
      accessorKey: 'lastUpdatedBy',
      header: 'LAST UPDATED BY',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
      
          <span className="whitespace-nowrap">
            {"John Doe"}
          </span>
        </div>
        // <div className="flex gap-2 items-center">
        //   {row.original.lastUpdatedBy?.avatar && (
        //     <img
        //       src={row.original.lastUpdatedBy.avatar}
        //       alt=""
        //       className="w-6 h-6 rounded-full"
        //     />
        //   )}
        //   <span className="whitespace-nowrap">
        //     {row.original.lastUpdatedBy?.name || '---'}
        //   </span>
        // </div>
      ),
    },
    {
      accessorKey: 'lastUpdatedDate',
      header: 'LAST UPDATED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {formatDate(row.original.lastUpdatedDate)} */}
          {"11/11/2023 12:00 PM"}
        </span>
      ),
    },
    {
      header: 'TIME TRACKING',
      cell: ({ row }) => '2h', // Placeholder value
    },
    {
      header: 'SUMMARY',
      cell: ({ row }) => (
        <SummaryCell text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
      ),
    },
    {
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) => {
        // const warning = row.original.warning
        // if (!warning || !warning.message) return null

        // let variant: 'warning' | 'danger' | 'pending'
        // let text: string

        // if (warning.type === 'MISSING_VOR') {
        //   variant = 'danger'
        //   text = 'OVERDUE'
        // } else if (warning.type === 'UPDATED_IN_CCC') {
        //   variant = 'warning'
        //   text = 'URGENT'
        // } else {
        //   variant = 'pending'
        //   text = 'PENDING'
        // }

        return (
          <div title={'warning.message'}>
            {/* <StatusBadge
              variant={variant}
              size="sm"
              className="whitespace-nowrap"
            >
              {text}
            </StatusBadge> */}
            <StatusBadge
              variant="danger"
              size="sm"
              className="whitespace-nowrap"
            >
              {"MISSING VOR"}
            </StatusBadge>
          </div>
        )
      },
    },
    {
      id: 'archive',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Archive"
            buttonIcon={<Archive className="mr-2 w-4 h-4" />}
            onClick={(e) => {
              e.stopPropagation()
              handleArchiveClick(row.original)
            }}
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
            e.stopPropagation() // Prevent row click when clicking the task button
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
