'use client'
import ConfirmationModal from '@/components/custom-components/confirmation-modal/confirmation-modal'
import { DataTable } from '@/components/custom-components/custom-table/data-table'
import { Opportunity } from '@/app/types/opportunity'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import OpportunityModal from '@/components/custom-components/opportunity-modal/opportunity-modal'
import { useState, useCallback, useMemo } from 'react'
import { Archive } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { mapApiResponseToOpportunity } from '@/app/utils/opportunityMapper'
import { useGetOpportunities } from '@/app/api/hooks/useOpportunities'
import { getOpportunityColumns } from './new-opportunities-columns'

export default function NewOpportunities() {
  const { data: session } = useSession()
  const tenantId = session?.user?.tenantId
  const { newOpportunities, isLoading } = useGetOpportunities({
    tenantId: tenantId!,
  })
  const [selectedOpportunity, setSelectedOpportunity] =
    useState<Opportunity | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [archiveConfirmation, setArchiveConfirmation] = useState<{
    isOpen: boolean
    opportunity: Opportunity | null
  }>({
    isOpen: false,
    opportunity: null,
  })

  const handleRowClick = useCallback(
    (opportunity: Opportunity) => {
      setSelectedOpportunity(opportunity)
      setIsModalOpen(true)
    },
    [setSelectedOpportunity]
  )

  const handleContactClick = useCallback((opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity)
    setIsModalOpen(true)
  }, [])

  const handleTaskClick = useCallback((opportunity: Opportunity) => {
    console.log('Task clicked for opportunity:', opportunity.opportunityId)
  }, [])

  // const handleArchiveConfirm = useCallback(() => {
  //   if (archiveConfirmation.opportunity) {
  //     archiveOpportunity(archiveConfirmation.opportunity.opportunityId)
  //     console.log('Archiving opportunity:', archiveConfirmation.opportunity.opportunityId)
  //   }
  // }, [archiveConfirmation.opportunity, archiveOpportunity])

  const handleArchiveClick = useCallback((opportunity: Opportunity) => {
    setArchiveConfirmation({
      isOpen: true,
      opportunity,
    })
  }, [])

  const formatDate = (date: string | undefined) => {
    if (!date) return '---'
    return new Date(date).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading opportunities...
      </div>
    )
  }

  const mappedOpportunities = useMemo(
    () => newOpportunities.map(mapApiResponseToOpportunity),
    [newOpportunities]
  )
  const columns = useMemo(
    () =>
      getOpportunityColumns({
        handleContactClick,
        handleArchiveClick,
        formatDate,
        archiveConfirmationOpportunityId:
          archiveConfirmation.opportunity?.opportunityId,
      }),
    [
      handleContactClick,
      handleArchiveClick,
      formatDate,
      archiveConfirmation.opportunity?.opportunityId,
    ]
  )

  return (
    <div className="w-full">
      <DataTable<Opportunity, any>
        columns={columns}
        data={mappedOpportunities}
        onRowClick={handleRowClick}
        pageSize={10}
        pageSizeOptions={[5, 10, 20, 30, 40, 50]}
      />

      <BottomSheetModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={
          selectedOpportunity
            ? `${selectedOpportunity.vehicle.year} ${selectedOpportunity.vehicle.make} ${selectedOpportunity.vehicle.model}`
            : ''
        }
      >
        {selectedOpportunity && (
          <OpportunityModal opportunity={selectedOpportunity} />
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
