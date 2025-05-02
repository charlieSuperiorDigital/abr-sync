'use client'
import DarkButton from '@/app/[locale]/custom-components/dark-button'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { Opportunity } from '@/app/types/opportunity'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { showArchiveToast } from '@/app/utils/toast-utils'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Archive, Plus } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useMemo, useState } from 'react'
import { getSecondCallColumns } from './second-call-columns'

type Props = {
  secondCalls: OpportunityResponse[]
}

export default function SecondCallOpportunities({ secondCalls }: Props) {
  const [archiveConfirmation, setArchiveConfirmation] = useState<{
    isOpen: boolean
    opportunity: Opportunity | null
  }>({
    isOpen: false,
    opportunity: null,
  })
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    opportunityId: string | null
  }>({
    isOpen: false,
    opportunityId: null,
  })

  const handleRowClick = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setModalState({
      isOpen: true,
      opportunityId: opportunity.opportunityId,
    })
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState((prev) => ({ ...prev, isOpen: open }))
  }, [])

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
      console.log(
        'Archiving opportunity:',
        archiveConfirmation.opportunity.opportunityId
      )
    }
  }, [archiveConfirmation.opportunity])

  const handleArchiveClick = useCallback((opportunity: Opportunity) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity,
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const columns = useMemo(
    () =>
      getSecondCallColumns({
        formatDate,
        handleArchiveClick,
      }),
    [formatDate, handleArchiveClick, secondCalls]
  )

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={secondCalls.map(mapApiResponseToOpportunity)}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />
      <BottomSheetModal
        isOpen={modalState.isOpen}
        onOpenChange={handleModalOpenChange}
        title={
          selectedOpportunity
            ? `${selectedOpportunity.vehicle?.year || ''} ${selectedOpportunity.vehicle?.make || ''} ${selectedOpportunity.vehicle?.model || ''}`
            : ''
        }
      >
        {modalState.opportunityId && (
          <OpportunityModal
            opportunityId={modalState.opportunityId}
            workfileId={undefined}
          />
        )}
      </BottomSheetModal>
      <ConfirmationModal
        isOpen={archiveConfirmation.isOpen}
        onClose={() =>
          setArchiveConfirmation({ isOpen: false, opportunity: null })
        }
        onConfirm={handleArchiveConfirm}
        title="Archive Opportunity"
        description="Are you sure you want to archive this opportunity? This action will remove it from the active opportunities list."
        confirmText="Archive"
        confirmIcon={Archive}
      />
    </div>
  )
}
