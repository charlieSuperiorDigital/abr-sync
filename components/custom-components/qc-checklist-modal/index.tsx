'use client'

import * as React from 'react'
import BottomSheetModal from '@/components/custom-components/bottom-sheet-modal/bottom-sheet-modal'
import QCChecklistModal from './qc-checklist-modal'
import { Workfile } from '@/app/types/workfile'
import { useGetQualityCheck } from '@/app/api/hooks/useQualityCheck'

interface QCChecklistBottomSheetProps {
  workfile: Workfile | null
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export default function QCChecklistBottomSheet({
  workfile,
  isOpen,
  onOpenChange
}: QCChecklistBottomSheetProps) {
  if (!workfile) return null
  
  const { qualityCheck, checks, isLoading, error } = useGetQualityCheck({
    workfileId: workfile.workfileId,
    enabled: isOpen
  })
  
  const handleClose = () => {
    onOpenChange(false)
  }
  
  return (
    <BottomSheetModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`QC Checklist - ${workfile.vehicle.make} ${workfile.vehicle.model}`}
    >
      <QCChecklistModal 
        workfile={workfile} 
        onClose={handleClose}
        qualityCheck={qualityCheck}
        checks={checks}
        isLoading={isLoading}
        error={error}
      />
    </BottomSheetModal>
  )
}
