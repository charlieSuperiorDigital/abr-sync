'use client'

import * as React from 'react'
import { Workfile } from '@/app/types/workfile'
import { QualityCheck, QualityCheckItem } from '@/app/types/quality-check'
import { useUpdateQualityCheckItem, useUpdateQualityCheck } from '@/app/api/hooks/useQualityCheck'
import { Button } from '@/components/ui/button'
import { Upload, Check, X, Settings } from 'lucide-react'
import { formatDate } from '@/app/utils/date-utils'
import QCChecklistSettingsModal from './qc-checklist-settings-modal'

interface QCChecklistModalProps {
  workfile: Workfile
  onClose: () => void
  qualityCheck: QualityCheck | undefined
  checks: QualityCheckItem[]
  isLoading: boolean
  error: Error | null
}

export default function QCChecklistModal({ 
  workfile,
  onClose,
  qualityCheck,
  checks,
  isLoading,
  error 
}: QCChecklistModalProps) {
  const { updateItem, isLoading: isUpdatingItem } = useUpdateQualityCheckItem()
  const { updateQualityCheck, isLoading: isUpdatingQC } = useUpdateQualityCheck()

  if (isLoading) {
    return <div>Loading quality check data...</div>
  }

  if (error) {
    return <div>Error loading quality check: {error.message}</div>
  }

  const handleCheckItem = async (item: QualityCheckItem, okStatus: boolean) => {
    await updateItem({
      id: item.id,
      name: item.name,
      okStatus,
      type: item.type,
      description: item.description,
      notes: item.notes
    })
  }

  const handleCompleteQC = async () => {
    if (qualityCheck) {
      await updateQualityCheck({
        qualityCheckId: qualityCheck.id,
        completed: true
      })
      onClose()
    }
  }

  const allChecksCompleted = checks.every(check => check.okStatus)

  return (
    <div className="p-4">
      <div className="space-y-4">
        {checks.map((check) => (
          <div key={check.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <h3 className="font-medium">{check.name}</h3>
              {check.description && (
                <p className="text-sm text-gray-500">{check.description}</p>
              )}
            </div>
            <input
              type="checkbox"
              checked={check.okStatus}
              onChange={(e) => handleCheckItem(check, e.target.checked)}
              disabled={isUpdatingItem}
              className="w-5 h-5"
            />
          </div>
        ))}
      </div>

      {allChecksCompleted && (
        <button
          onClick={handleCompleteQC}
          disabled={isUpdatingQC}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Complete Quality Check
        </button>
      )}
    </div>
  )
}
