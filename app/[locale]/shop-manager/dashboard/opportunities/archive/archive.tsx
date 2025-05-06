'use client'
import { OpportunityResponse } from '@/app/types/opportunities'
import { showUnarchiveToast } from '@/app/utils/toast-utils'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useCallback, useMemo, useState } from 'react'
import { getArchivedColumns } from './archive-columns'

type Props = {
  archived: OpportunityResponse[]
}

export default function ArchivedOpportunities({ archived }: Props) {
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

  const handleContactClick = useCallback((opportunity: OpportunityResponse) => {
    // Handle contact info click based on opportunity state
    console.log('Contact clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleTaskClick = useCallback((opportunity: OpportunityResponse) => {
    // Handle task button click based on opportunity state
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleUnarchive = useCallback((opportunity: OpportunityResponse) => {
    // TODO: Implement unarchive API call
    showUnarchiveToast(opportunity)
    console.log('Unarchiving opportunity:', opportunity.opportunityId)
  }, [])

  const handleModalOpenChange = useCallback((open: boolean) => {
    setModalState((prev) => ({ ...prev, isOpen: open }))
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns = useMemo(
    () =>
      getArchivedColumns({
        formatDate,
        handleUnarchive,
      }),
    [formatDate, handleUnarchive, archived]
  )

  return (
    <div className="w-full">
      <DataTable<OpportunityResponse, any>
        columns={columns}
        data={archived}
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
    </div>
  )
}
