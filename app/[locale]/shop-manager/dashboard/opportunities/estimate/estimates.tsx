'use client'
import ContactInfo from '@/app/[locale]/custom-components/contact-info'
import { OpportunityResponse } from '@/app/api/functions/opportunities'
import { ContactData, ContactMethod } from '@/app/types/contact-info.types'
import { Opportunity } from '@/app/types/opportunity'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import {
  AutoCell,
  SummaryCell,
  VehicleCell,
} from '@/components/custom-components/custom-table/table-cells'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { StatusBadge } from '@/components/custom-components/status-badge/status-badge'
import { NewTaskModal } from '@/components/custom-components/task-modal/new-task-modal'
import { ColumnDef } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useCallback, useMemo, useState } from 'react'
import { getEstimateColumns } from './estimate-columns'

const PdfPreview = dynamic(
  () => import('@/app/[locale]/custom-components/pdf-preview'),
  {
    ssr: false,
  }
)

type Props = {
  estimates: OpportunityResponse[]
}

export default function EstimateOpportunities({ estimates }: Props) {
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

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  const columns = useMemo(
    () =>
      getEstimateColumns({
        handleContactClick,
        PdfPreviewComponent: PdfPreview,
      }),
    [handleContactClick, PdfPreview, estimates]
  )

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={estimates.map(mapApiResponseToOpportunity)}
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
