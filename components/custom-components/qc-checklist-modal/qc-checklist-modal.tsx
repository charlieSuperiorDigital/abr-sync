'use client'

import * as React from 'react'
import { Workfile, QualityControlChecklistItem, QualityControlStatus } from '@/app/types/workfile'
import { QualityCheckItem } from '@/app/types/quality-check'
import { Button } from '@/components/ui/button'
import { Upload, Check, X, Settings } from 'lucide-react'
import { formatDate } from '@/app/utils/date-utils'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { useGetQualityCheck } from '@/app/api/hooks/useQualityCheck'
import { useUpdateQualityCheckItem } from '@/app/api/hooks/useQualityCheck'
import { useUpdateQualityCheck } from '@/app/api/hooks/useQualityCheck'
import QCChecklistSettingsModal from './qc-checklist-settings-modal'

interface QCChecklistModalProps {
  workfile: Workfile
  onClose?: () => void
}

export default function QCChecklistModal({ workfile, onClose }: QCChecklistModalProps) {
  const { qualityCheck, checks, isLoading, error } = useGetQualityCheck({ workfileId: workfile.id })
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null)
  const { updateItem, isLoading: isUpdating } = useUpdateQualityCheckItem()
  const { updateQualityCheck, isLoading: isCompletingQC } = useUpdateQualityCheck();

  // Defensive: fallback for missing vehicle
  const safeVehicle = workfile.vehicle || { make: '---', model: '---', year: '---', vehiclePicturesUrls: [], vin: '---' };

  React.useEffect(() => {
    console.log('Current workfile ID:', workfile.id)
  }, [workfile.id])


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <span className="text-lg font-semibold">Loading quality check data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-red-500">
        <span>Error loading quality check: {error.message}</span>
      </div>
    )
  }

  // Determine if all checks are completed
  const allItemsCompleted = checks.length > 0 && checks.every(item => item.okStatus)

  // Handle marking QC as complete
  const handleMarkQCComplete = () => {
    if (!qualityCheck) return;
    updateQualityCheck(
      { qualityCheckId: qualityCheck.id, completed: true },
      { onSuccess: () => onClose && onClose() }
    );
  };

  // Format date helper
  const formatDateWithTime = (dateString?: string | null) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }

  // Handler for Yes/No
  const handleSetCompleted = (item: QualityCheckItem, okStatus: boolean) => {
    setUpdatingItemId(item.id)
    updateItem({
      id: item.id,
      name: item.name,
      okStatus,
      type: item.type,
      description: item.description,
      notes: item.notes || ''
    }, {
      onSettled: () => setUpdatingItemId(null)
    })
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header with progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quality Control Checklist</h2>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleMarkQCComplete}
                disabled={isCompletingQC || !allItemsCompleted}
                className="px-6 py-2 text-white bg-black rounded-xl hover:bg-neutral-900"
              >
                {isCompletingQC ? (
                  <svg className="mr-2 w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                ) : 'Mark QC as complete'}
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-600 rounded-full"
            style={{
              width: `${(checks.filter(item => item.okStatus).length / (checks.length || 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Checklist items in two columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {checks.slice(0, Math.ceil(checks.length / 2)).map((item, index) => (
            <div key={item.id} className="flex relative justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  {item.okStatus ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                  {item.updatedAt && (
                    <div className="text-xs text-gray-400">{formatDateWithTime(item.updatedAt)}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.okStatus ? "default" : "outline"}
                  size="sm"
                  className={`rounded-2xl px-5 py-1.5 ${item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                  onClick={() => handleSetCompleted(item, true)}
                  disabled={isUpdating && updatingItemId === item.id}
                >
                  Yes
                </Button>
                <Button
                  variant={!item.okStatus ? "default" : "outline"}
                  size="sm"
                  className={`rounded-2xl px-5 py-1.5 ${!item.okStatus ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(item, false)}
                  disabled={isUpdating && updatingItemId === item.id}
                >
                  No
                </Button>
              </div>
              {(isUpdating && updatingItemId === item.id) && (
                <div className="flex absolute inset-0 z-10 justify-center items-center bg-white/60">
                  <span className="loader" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-6">
          {checks.slice(Math.ceil(checks.length / 2)).map((item, index) => (
            <div key={item.id} className="flex relative justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  {item.okStatus ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium">{item.name}</div>
                  {item.description && (
                    <div className="text-xs text-gray-500">{item.description}</div>
                  )}
                  {item.updatedAt && (
                    <div className="text-xs text-gray-400">{formatDateWithTime(item.updatedAt)}</div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.okStatus ? "default" : "outline"}
                  size="sm"
                  className={`rounded-2xl px-5 py-1.5 ${item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                  onClick={() => handleSetCompleted(item, true)}
                  disabled={isUpdating && updatingItemId === item.id}
                >
                  Yes
                </Button>
                <Button
                  variant={!item.okStatus ? "default" : "outline"}
                  size="sm"
                  className={`rounded-2xl px-5 py-1.5 ${!item.okStatus ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(item, false)}
                  disabled={isUpdating && updatingItemId === item.id}
                >
                  No
                </Button>
              </div>
              {(isUpdating && updatingItemId === item.id) && (
                <div className="flex absolute inset-0 z-10 justify-center items-center bg-white/60">
                  <span className="loader" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Settings modal (if needed) */}
      {settingsOpen && (
        <QCChecklistSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          workfileId={workfile.id}
          qualityCheckId={qualityCheck?.id || ''}
          checklist={checks}
          status={qualityCheck?.status || QualityControlStatus.AWAITING}
        />
      )}
    </div>
  )
}
