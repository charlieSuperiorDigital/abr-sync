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
import { ClipboardPlus, Archive, Plus } from 'lucide-react'
import { Opportunity, OpportunityStatus, PartsWarningStatus } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback } from 'react'
import { useOpportunityStore } from '@/app/stores/opportunity-store'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'

export default function NewOpportunities() {
  const { getOpportunitiesByStatus, setSelectedOpportunity, selectedOpportunity, archiveOpportunity } = useOpportunityStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [archiveConfirmation, setArchiveConfirmation] = useState<{ isOpen: boolean; opportunity: Opportunity | null }>({
    isOpen: false,
    opportunity: null
  })

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

  const handleArchiveConfirm = useCallback(() => {
    if (archiveConfirmation.opportunity) {
      archiveOpportunity(archiveConfirmation.opportunity.opportunityId)
      console.log('Archiving opportunity:', archiveConfirmation.opportunity.opportunityId)
    }
  }, [archiveConfirmation.opportunity, archiveOpportunity])

  const handleArchiveClick = useCallback((opportunity: Opportunity) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity
    })
  }, [])

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
      cell: ({ row }) => {
        const warning = row.original.warning;
        if (!warning || !warning.message) return null;

        // Determine variant and text based on warning type
        let variant: 'warning' | 'danger';
        let text: string;

        if (warning.type === 'MISSING_VOR') {
          variant = 'danger';
          text = 'OVERDUE';
        } else if (warning.type === 'UPDATED_IN_CCC') {
          variant = 'warning';
          text = 'URGENT';
        } else {
          return null; // No warning display for other cases
        }

        return (
          <div title={warning.message}>
            <StatusBadge
              variant={variant}
              size="sm"
              className="whitespace-nowrap"
            >
              {text}
            </StatusBadge>
          </div>
        );
      },
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
      cell: ({ row }) => <SummaryCell text='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' />,
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
      header: '',
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
              <Plus className="w-5 h-5 m-auto" />
            }
          />
        </div>
      ),
    },
    {
      id: 'archive',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DarkButton
            buttonText="Archive"
            buttonIcon={<Archive className="w-4 h-4 mr-2" />}
            onClick={(e) => {
              e.stopPropagation()
              handleArchiveClick(row.original)
            }}
          />
        </div>
      ),
    },
  ]

  // Get opportunities in New status from the store
  const opportunities = getOpportunitiesByStatus(OpportunityStatus.New)

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

      <ConfirmationModal
        isOpen={archiveConfirmation.isOpen}
        onClose={() => setArchiveConfirmation({ isOpen: false, opportunity: null })}
        onConfirm={handleArchiveConfirm}
        title="Archive Opportunity"
        description="Are you sure you want to archive this opportunity? You can unarchive it later if needed."
        confirmText="Archive"
        confirmIcon={Archive}
      />
    </div>
  )
}
