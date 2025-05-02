'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'

import { Car } from 'lucide-react'
import { Opportunity } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback, useMemo } from 'react'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { showPickupToast } from '@/app/utils/toast-utils'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { getTotalLossColumns } from './total-loss-columns'

type Props = {
  totalLoss: OpportunityResponse[]
}

export default function TotalLossOpportunities({ totalLoss }: Props) {
  const [pickupConfirmation, setPickupConfirmation] = useState<{
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

  const handlePickupConfirm = useCallback(() => {
    if (pickupConfirmation.opportunity) {
      // TODO: Implement pickup API call
      showPickupToast(pickupConfirmation.opportunity)
      console.log(
        'Marking opportunity as picked up:',
        pickupConfirmation.opportunity.opportunityId
      )
    }
  }, [pickupConfirmation.opportunity])

  const handlePickupClick = useCallback((opportunity: Opportunity) => {
    setPickupConfirmation({
      isOpen: true,
      opportunity,
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns = useMemo(
    () =>
      getTotalLossColumns({
        handlePickupClick,
      }),
    [handlePickupClick, totalLoss]
  )

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={totalLoss.map(mapApiResponseToOpportunity)}
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
        isOpen={pickupConfirmation.isOpen}
        onClose={() =>
          setPickupConfirmation({ isOpen: false, opportunity: null })
        }
        onConfirm={handlePickupConfirm}
        title="Mark Vehicle as Picked Up"
        description="Are you sure you want to mark this vehicle as picked up? This will archive the opportunity and record the pickup date."
        confirmText="Mark as Picked Up"
        confirmIcon={Car}
      />
    </div>
  )
}
