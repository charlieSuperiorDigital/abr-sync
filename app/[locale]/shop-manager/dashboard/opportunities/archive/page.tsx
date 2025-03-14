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
import { useOpportunityStore } from '@/app/stores/opportunity-store'

export default function ArchivedOpportunities() {
  const { getOpportunitiesByStatus, setSelectedOpportunity, selectedOpportunity, updateOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    // Return to previous status based on repair stage
    if (opportunity.stage === RepairStage.RepairOrder) {
      updateOpportunity(opportunity.opportunityId, {
        status: OpportunityStatus.Upcoming
      })
    } else if (opportunity.estimateAmount) {
      updateOpportunity(opportunity.opportunityId, {
        status: OpportunityStatus.Estimate
      })
    } else {
      updateOpportunity(opportunity.opportunityId, {
        status: OpportunityStatus.New
      })
    }
    console.log('Unarchiving opportunity:', opportunity.opportunityId)
  }, [updateOpportunity])

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
        <span className="whitespace-nowrap text-gray-600">
          {formatDate(row.original.firstCallDate)}
        </span>
      ),
    },
    {
      accessorKey: 'secondCallDate',
      header: '2ND CALL',
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-gray-600">
          {formatDate(row.original.secondCallDate)}
        </span>
      ),
    },
    {
      accessorKey: 'lastUpdatedBy',
      header: 'LAST UPDATED BY',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
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
      cell: ({ row }) => <SummaryCell />,
    },
   
    {
      id: 'unarchive',
      header: 'Unarchive',
      cell: ({ row }) => (
        <button
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
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

  // Get opportunities in "Archived" status from the store
  const opportunities = getOpportunitiesByStatus(OpportunityStatus.Archived)

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={opportunities}
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
