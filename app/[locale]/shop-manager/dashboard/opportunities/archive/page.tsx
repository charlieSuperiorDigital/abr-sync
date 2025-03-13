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
      accessorKey: 'insurance.claimNumber',
      header: 'Claim',
    },
    {
      accessorKey: 'insurance.company',
      header: 'Insurance',
      cell: ({ row }) => (
        <span className={`whitespace-nowrap font-bold ${row.original.insurance.company === 'PROGRESSIVE' ? 'text-blue-700' : ''}`}>
          {row.original.insurance.company.toUpperCase()}
        </span>
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
    },
    {
      accessorKey: 'isInRental',
      header: 'In Rental',
      cell: ({ row }) => (row.original.isInRental ? <AutoCell /> : null),
    },
    {
      accessorKey: 'dropDate',
      header: 'Drop Date',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.dropDate)}</span>
      ),
    },
    {
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) =>
        row.original.warning ? (
          <StatusBadgeCell
            variant="danger"
            status="danger"
          />
        ) : null,
    },
    {
      id: 'uploadDeadline',
      header: 'Upload Deadline',
      cell: ({ row }) => (
        row.original.uploadDeadline ? (
          <UploadTimeCell deadline={row.original.uploadDeadline} />
        ) : (
          <span className="text-gray-400">---</span>
        )
      ),
    },
    {
      id: 'lastCommDate',
      header: 'Last Communication',
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{formatDate(row.original.lastUpdatedDate)}</span>
      ),
    },
    {
      header: 'Summary',
      cell: ({ row }) => <SummaryCell />,
    },
    {
      id: 'contact',
      header: 'Contact',
      cell: ({ row }) => (
        <div 
          data-testid="contact-info" 
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleContactClick(row.original)
          }}
        >
          <ContactInfo />
        </div>
      ),
    },
    {
      id: 'task',
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
