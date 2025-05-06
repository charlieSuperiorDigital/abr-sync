'use client'
import { DataTable } from '@/components/custom-components/custom-table/data-table'

import { Car } from 'lucide-react'
import { OpportunityResponse } from '@/app/types/opportunities'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback, useMemo } from 'react'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { showPickupToast } from '@/app/utils/toast-utils'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { getTotalLossColumns } from './total-loss-columns'

type Props = {
  totalLossOpportunities: OpportunityResponse[]
}

export default function TotalLossOpportunities({ totalLossOpportunities }: Props) {
  const [pickupConfirmation, setPickupConfirmation] = useState<{
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

  const handlePickupClick = useCallback((opportunity: OpportunityResponse) => {
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
    [handlePickupClick, totalLossOpportunities]
  )

  return (
    <div className="w-full">
      <DataTable<OpportunityResponse, any>
        columns={columns}
        data={totalLossOpportunities}
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
