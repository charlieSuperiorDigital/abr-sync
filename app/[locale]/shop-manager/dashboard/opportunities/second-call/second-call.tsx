'use client'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { showArchiveToast } from '@/app/utils/toast-utils'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { Archive } from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { getSecondCallColumns } from './second-call-columns'
import { OpportunityResponse } from '@/app/types/opportunities'

type Props = {
  secondCalls: OpportunityResponse[]
}

export default function SecondCallOpportunities({ secondCalls }: Props) {
  const [archiveConfirmation, setArchiveConfirmation] = useState<{
    isOpen: boolean
    opportunity: OpportunityResponse | null
  }>({
    isOpen: false,
    opportunity: null,
  })
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityResponse | null>(null)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    opportunityId: string | null
  }>({
    isOpen: false,
    opportunityId: null,
  })

  const handleRowClick = useCallback((opportunity: OpportunityResponse) => {
    setSelectedOpportunity(opportunity)
    setModalState({
      isOpen: true,
      opportunityId: opportunity.opportunityId,
    })
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState((prev) => ({ ...prev, isOpen: open }))
  }, [])

  const handleContactClick = useCallback((opportunity: OpportunityResponse) => {
    // Handle contact info click based on opportunity state
    console.log('Contact clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleTaskClick = useCallback((opportunity: OpportunityResponse) => {
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

  const handleArchiveClick = useCallback((opportunity: OpportunityResponse) => {
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
      <DataTable<OpportunityResponse, any>
        columns={columns}
        data={secondCalls}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />
      <BottomSheetModal
        isOpen={modalState.isOpen}
        onOpenChange={handleModalOpenChange}
        title={
          selectedOpportunity
            ? `${selectedOpportunity.vehicleYear || ''} ${selectedOpportunity.vehicleMake || ''} ${selectedOpportunity.vehicleModel || ''}`
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
