'use client'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { OpportunityResponse } from '@/app/types/opportunities'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback, useMemo } from 'react'
import { Archive } from 'lucide-react'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { getOpportunityColumns } from './new-opportunities-columns'

type Props = {
  newOpportunities: OpportunityResponse[]
}

export default function NewOpportunities({ newOpportunities }: Props) {
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<OpportunityResponse | null>(null)
  const [modalState, setModalState] = useState<{
    isOpen: boolean
    opportunityId: string | null
  }>({
    isOpen: false,
    opportunityId: null,
  })

  const [archiveConfirmation, setArchiveConfirmation] = useState<{
    isOpen: boolean
    opportunity: OpportunityResponse | null
  }>({
    isOpen: false,
    opportunity: null,
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
    setSelectedOpportunity(opportunity)
    setModalState({
      isOpen: true,
      opportunityId: opportunity.opportunityId,
    })
  }, [])

  const handleTaskClick = useCallback((opportunity: OpportunityResponse) => {
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  // const handleArchiveConfirm = useCallback(() => {
  //   if (archiveConfirmation.opportunity) {
  //     archiveOpportunity(archiveConfirmation.opportunity.opportunityId)
  //     console.log('Archiving opportunity:', archiveConfirmation.opportunity.opportunityId)
  //   }
  // }, [archiveConfirmation.opportunity, archiveOpportunity])

  const handleArchiveClick = useCallback((opportunity: OpportunityResponse) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity,
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       Loading opportunities...
  //     </div>
  //   )
  // }


  const columns = useMemo(
    () =>
      getOpportunityColumns({
        handleContactClick,
        handleArchiveClick,
        handleTaskClick,
        formatDate,
        archiveConfirmationOpportunityId:
          archiveConfirmation.opportunity?.opportunityId,
      }),
    [
      handleContactClick,
      handleArchiveClick,
      formatDate,
      archiveConfirmation.opportunity?.opportunityId,
      newOpportunities,
    ]
  )

  return (
    <div className="w-full">
      <DataTable<OpportunityResponse, any>
        columns={columns}
        data={newOpportunities}
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
        onConfirm={() => {}}
        // onConfirm={handleArchiveConfirm}
        title="Archive Opportunity"
        description="Are you sure you want to archive this opportunity? You can unarchive it later if needed."
        confirmText="Archive"
        confirmIcon={Archive}
      />
    </div>
  )
}
