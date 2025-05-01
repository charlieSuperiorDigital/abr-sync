'use client'

import { useGetQualityCheck } from '@/app/api/hooks/useQualityCheck'
import { WorkfilesByTenantIdResponse } from '@/app/types/workfile'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import QCChecklistModal from './qc-checklist-modal'

interface QCChecklistBottomSheetProps {
  workfile: WorkfilesByTenantIdResponse | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function QCChecklistBottomSheet({
  workfile,
  isOpen,
  onOpenChange
}: QCChecklistBottomSheetProps) {
  if (!workfile) return null
  
  // Defensive: fallback for missing vehicle
  const safeVehicle = workfile.opportunity.vehicle || { make: '---', model: '---' };

  const { qualityCheck, checks, isLoading, error } = useGetQualityCheck({
    workfileId: workfile.id,
    enabled: isOpen
  })
  
  const handleClose = () => {
    onOpenChange(false)
  }
  
  return (
    <BottomSheetModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`QC Checklist - ${safeVehicle.make} ${safeVehicle.model}`}
    >
      <QCChecklistModal 
        workfile={workfile} 
        onClose={handleClose}
      />
    </BottomSheetModal>
  )
}
