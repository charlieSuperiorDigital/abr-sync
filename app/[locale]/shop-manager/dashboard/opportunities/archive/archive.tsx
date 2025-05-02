'use client'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { showUnarchiveToast } from '@/app/utils/toast-utils'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'

import { ClipboardPlus } from 'lucide-react'
import {
  Opportunity,
  OpportunityStatus,
  RepairStage,
} from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { ColumnDef } from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { getArchivedColumns } from './archive-columns'

type Props = {
  archived: OpportunityResponse[]
}

export default function ArchivedOpportunities({ archived }: Props) {
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

  const handleContactClick = useCallback((opportunity: Opportunity) => {
    // Handle contact info click based on opportunity state
    console.log('Contact clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleTaskClick = useCallback((opportunity: Opportunity) => {
    // Handle task button click based on opportunity state
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  const handleUnarchive = useCallback((opportunity: Opportunity) => {
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
      <DataTable<Opportunity, any>
        columns={columns}
        data={archived.map(mapApiResponseToOpportunity)}
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
    </div>
  )
}
