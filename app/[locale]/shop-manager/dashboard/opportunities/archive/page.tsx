'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  AutoCell,
  StatusBadgeCell,
  SummaryCell,
  UploadTimeCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { ColumnDef } from '@tanstack/react-table'
import { ClipboardPlus } from 'lucide-react'
import { Opportunity, OpportunityStatus, RepairStage } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useGetOpportunities'
import { showUnarchiveToast } from '@/app/utils/toast-utils'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'

export default function ArchivedOpportunities() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { archivedOpportunities, isLoading } = useGetOpportunities({ tenantId: tenantId! })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null)

  const handleRowClick = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }, [setSelectedOpportunity])

  const handleContactClick = useCallback((opportunity: Opportunity) => {
    // Handle contact info click based on opportunity state
    console.log('Contact clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleTaskClick = useCallback((opportunity: Opportunity) => {
    // Handle task button click based on opportunity state
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleUnarchive = useCallback((opportunity: Opportunity) => {
    // TODO: Implement unarchive API call
    showUnarchiveToast(opportunity)
    console.log('Unarchiving opportunity:', opportunity.opportunityId)
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns: ColumnDef<Opportunity, any>[] = [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'vehicle',
      header: 'Vehicle',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={row.original.vehicle.year}
          imageUrl={`https://picsum.photos/seed/${row.original.opportunityId}/200/100`}
        />
      ),
    },
    {
      accessorKey: 'status',
      header: 'Previous Status',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.status}</span>
      ),
    },
    {
      accessorKey: 'roNumber',
      header: 'RO',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.roNumber || '---'}</span>
      ),
    },
    {
      accessorKey: 'owner.name',
      header: 'Owner',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.owner.name}
        </span>
      ),
    }, {
      accessorKey: 'firstCallDate',
      header: '1ST CALL',
      cell: ({ row }) => (
        <span className="text-gray-600 whitespace-nowrap">
          {formatDate(row.original.firstCallDate)}
        </span>
      ),
    },
    {
      accessorKey: 'secondCallDate',
      header: '2ND CALL',
      cell: ({ row }) => (
        <span className="text-gray-600 whitespace-nowrap">
          {formatDate(row.original.secondCallDate)}
        </span>
      ),
    },
    {
      accessorKey: 'lastUpdatedBy',
      header: 'LAST UPDATED BY',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          {row.original.lastUpdatedBy?.avatar && (
            <img
              src={row.original.lastUpdatedBy.avatar}
              alt=""
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="whitespace-nowrap">
            {row.original.lastUpdatedBy?.name || '---'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'lastUpdatedDate',
      header: 'LAST UPDATED',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.lastUpdatedDate)}</span>
      ),
    },
    {
      header: 'TIME TRACKING',
      cell: ({ row }) => '2h',
    },
    {
      header: 'SUMMARY',
      cell: ({ row }) => <SummaryCell text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' />,
    },
   {
      id: 'unarchive',
      header: 'Unarchive',
      cell: ({ row }) => (
        <button
          className="px-4 py-2 text-white bg-black rounded-md transition-colors hover:bg-gray-800"
          onClick={(e) => {
            e.stopPropagation()
            handleUnarchive(row.original)
          }}
        >
          Unarchive
        </button>
      ),
    },
  ]

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading opportunities...</div>
  }

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={archivedOpportunities.map(mapApiResponseToOpportunity)}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      <BottomSheetModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={selectedOpportunity ? `${selectedOpportunity.vehicle.year} ${selectedOpportunity.vehicle.make} ${selectedOpportunity.vehicle.model}` : ''}
      >
        {selectedOpportunity && <OpportunityModal opportunity={selectedOpportunity} />}
      </BottomSheetModal>
    </div>
  )
}
