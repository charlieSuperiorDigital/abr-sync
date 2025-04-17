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
import { Archive, ClipboardPlus, Plus } from 'lucide-react'
import { Opportunity, OpportunityStatus, PartsWarningStatus } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useGetOpportunities } from '@/app/api/hooks/useGetOpportunities'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { showArchiveToast } from '@/app/utils/toast-utils'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'

export default function SecondCallOpportunities() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { secondCallOpportunities, isLoading } = useGetOpportunities({ tenantId: tenantId! })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [archiveConfirmation, setArchiveConfirmation] = useState<{ isOpen: boolean; opportunity: Opportunity | null }>({
    isOpen: false,
    opportunity: null
  })
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

  const handleArchiveConfirm = useCallback(() => {
    if (archiveConfirmation.opportunity) {
      // TODO: Implement archive API call
      showArchiveToast(archiveConfirmation.opportunity)
      console.log('Archiving opportunity:', archiveConfirmation.opportunity.opportunityId)
    }
  }, [archiveConfirmation.opportunity])

  const handleArchiveClick = useCallback((opportunity: Opportunity) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const columns: ColumnDef<Opportunity, any>[] = [
    {
      accessorKey: 'insurance.claimNumber',
      header: 'CLAIM',
    },
    {
      accessorKey: 'vehicle',
      header: 'VEHICLE',
      cell: ({ row }) => (
        <VehicleCell
          make={row.original.vehicle.make}
          model={row.original.vehicle.model}
          year={String(row.original.vehicle.year)}
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
    },
    {
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
      accessorKey: 'warning',
      header: 'Warning',
      cell: ({ row }) => {
        const warning = row.original.warning;
        if (!warning || !warning.message) return null;

        // Determine variant and text based on warning type
        let variant: 'warning' | 'danger' | 'pending';
        let text: string;

        if (warning.type === 'MISSING_VOR') {
          variant = 'danger';
          text = 'OVERDUE';
        } else if (warning.type === 'UPDATED_IN_CCC') {
          variant = 'warning';
          text = 'URGENT';
        } else {
          variant = 'pending';
          text = 'PENDING';
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

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading opportunities...</div>
  }

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={secondCallOpportunities.map(mapApiResponseToOpportunity)}
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
        description="Are you sure you want to archive this opportunity? This action will remove it from the active opportunities list."
        confirmText="Archive"
        confirmIcon={Archive}
      />
    </div>
  )
}
