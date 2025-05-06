// src/app/[locale]/components/archived-opportunities/archivedColumns.tsx


import { OpportunityResponse } from '@/app/types/opportunities'
import {
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import { ColumnDef } from '@tanstack/react-table'

type GetArchivedColumnsProps = {
  formatDate: (date: string | undefined) => string
  handleUnarchive: (opportunity: OpportunityResponse) => void
}

export const getArchivedColumns = ({
  formatDate,
  handleUnarchive,
}: GetArchivedColumnsProps): ColumnDef<OpportunityResponse, any>[] => {
  return [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'vehicleId',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicleMake}
          model={row.original.vehicleModel}
          year={row.original.vehicleYear.toString()}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Previous Status',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.opportunityStatus}</span>
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
      accessorKey: 'ownerName',
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
          {/* {row.original.lastUpdatedBy?.avatar && (
            <img
              src={row.original.lastUpdatedBy.avatar}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )} */}
          <span className="whitespace-nowrap">
            {/* {row.original.lastUpdatedBy?.name || '---'} */}
            {"PLACEHOLDER"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'lastUpdatedDate',
      header: 'LAST UPDATED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {/* {formatDate(row.original.lastUpdatedDate)} */}
          {"11/11/2025 11:11 AM"}
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
      id: 'unarchive',
      header: 'Unarchive',
      cell: ({ row }) => (
        <button
          className="px-4 py-2 text-white bg-black rounded-md transition-colors hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation() // Prevent row click
            handleUnarchive(row.original)
          }}
        >
          Unarchive
        </button>
      ),
    },
  ]
}
