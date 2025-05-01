'use client'

import { useGetQualityCheck, useUpdateQualityCheck, useUpdateQualityCheckItem, useQualityCheckImageMutations } from '@/app/api/hooks/useQualityCheck'
import { QualityCheckItem } from '@/app/types/quality-check'
import { Workfile } from '@/app/types/workfile'
import { Button } from '@/components/ui/button'
import { Check, Settings, X, Upload } from 'lucide-react'
import * as React from 'react'
import QCChecklistSettingsModal from './qc-checklist-settings-modal'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'react-toastify';
import { WorkfilesByTenantIdResponse } from '@/app/types/workfile'

interface QCChecklistModalProps {
  workfile: WorkfilesByTenantIdResponse 
  onClose?: () => void
}

export default function QCChecklistModal({ workfile, onClose }: QCChecklistModalProps) {
  const { qualityCheck, checks, isLoading, error } = useGetQualityCheck({ workfileId: workfile?.id })
  const [settingsOpen, setSettingsOpen] = React.useState(false)
  const [updatingItemId, setUpdatingItemId] = React.useState<string | null>(null)
  const { updateItem, isLoading: isUpdating } = useUpdateQualityCheckItem()
  const { updateQualityCheck, isLoading: isCompletingQC } = useUpdateQualityCheck();
  const { addImage, isAddingImage, addImageError } = useQualityCheckImageMutations();
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);

  // Defensive: fallback for missing vehicle
  const safeVehicle = workfile?.opportunity.vehicle || { make: '---', model: '---', year: '---', vehiclePicturesUrls: [], vin: '---' };

  React.useEffect(() => {
    console.log('Current workfile ID:', workfile?.id)
  }, [workfile?.id])

  // Only show enabled items
  const enabledChecks = checks.filter(item => item.enabled);

  // Helper to identify special QC items
  const SPECIAL_QC_NAMES = [
    'Quality Control Photos',
    'Pre Scan',
    'Post Scan',
  ];

  const specialChecks = enabledChecks.filter(item => SPECIAL_QC_NAMES.includes(item.name));
  const normalChecks = enabledChecks.filter(item => !SPECIAL_QC_NAMES.includes(item.name));

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
  const allItemsCompleted = enabledChecks.length > 0 && enabledChecks.every(item => item.okStatus)

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
      enabled: item.enabled,
      okStatus,
      type: item.type,
      description: item.description,
      notes: item.notes || ''
    }, {
      onSettled: () => setUpdatingItemId(null)
    })
  }

  const handleUpload = (itemId: string, file: File) => {
    setUploadingId(itemId);
    addImage(
      { id: itemId, file },
      {
        onSuccess: () => {
          toast.success('File uploaded successfully!');
          setUploadingId(null);
          // After upload, mark item as completed (okStatus = true)
          updateItem({ id: itemId, okStatus: true });
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to upload file.');
          setUploadingId(null);
        },
      }
    );
  };

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
              className="flex gap-2 items-center px-4 py-2"
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
              width: `${(enabledChecks.filter(item => item.okStatus).length / (enabledChecks.length || 1)) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Checklist items in two columns */}
      <TooltipProvider delayDuration={0}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-6">
            {normalChecks.slice(0, Math.ceil(normalChecks.length / 2)).map((item, index) => (
              <div key={item.id} className="flex relative justify-between items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-3 items-center cursor-pointer" tabIndex={0}>
                      <div className="flex justify-center items-center w-8 h-8">
                        {item.okStatus ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={5} className="w-[400px] max-w-[400px] text-sm">
                    <p>{item.description ? item.description : "No description entered"}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-2">
                  <Button
                    variant={item.okStatus ? "default" : "outline"}
                    size="sm"
                    className={`rounded-2xl px-5 py-1.5 ${item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                    onClick={() => handleSetCompleted(item, true)}
                    disabled={isUpdating && updatingItemId === item.id}
                  >
                    {isUpdating && updatingItemId === item.id ? (
                      <svg className="mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : 'Yes'}
                  </Button>
                  <Button
                    variant={!item.okStatus ? "default" : "outline"}
                    size="sm"
                    className={`rounded-2xl px-5 py-1.5 ${!item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                    onClick={() => handleSetCompleted(item, false)}
                    disabled={isUpdating && updatingItemId === item.id}
                  >
                    {isUpdating && updatingItemId === item.id ? (
                      <svg className="mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : 'No'}
                  </Button>
                </div>
              </div>
            ))}
            {/* Special QC Items - always last */}
            {specialChecks.map(item => (
              <div key={item.id} className="flex relative justify-between items-center p-3 mt-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-3 items-center cursor-pointer" tabIndex={0}>
                      <div className="flex justify-center items-center w-8 h-8">
                        {/* No icon here, icon will be inside the button */}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-black">{item.name}</div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={5} className="w-[400px] max-w-[400px] text-sm">
                    <p>{item.description ? item.description : "No description entered"}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-2">
                  {item.okStatus ? (
                    <span className="font-semibold text-green-700">File Uploaded</span>
                  ) : (
                    <>
                      <input
                        type="file"
                        id={`qc-upload-${item.id}`}
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(item.id, file);
                          // Reset value so same file can be re-uploaded
                          e.target.value = '';
                        }}
                        disabled={uploadingId === item.id}
                      />
                      <label htmlFor={`qc-upload-${item.id}`}>
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-2xl px-5 py-1.5 bg-white text-black border border-black hover:bg-neutral-100 flex items-center gap-2"
                          disabled={uploadingId === item.id}
                          asChild
                        >
                          <span className="flex gap-2 items-center">
                            {uploadingId === item.id ? (
                              <svg className="mr-2 w-4 h-4 text-black animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                              </svg>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-black" />
                                Upload
                              </>
                            )}
                          </span>
                        </Button>
                      </label>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            {normalChecks.slice(Math.ceil(normalChecks.length / 2)).map((item, index) => (
              <div key={item.id} className="flex relative justify-between items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex gap-3 items-center cursor-pointer" tabIndex={0}>
                      <div className="flex justify-center items-center w-8 h-8">
                        {item.okStatus ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center" sideOffset={5} className="w-[400px] max-w-[400px] text-sm">
                    <p>{item.description ? item.description : "No description entered"}</p>
                  </TooltipContent>
                </Tooltip>
                <div className="flex gap-2">
                  <Button
                    variant={item.okStatus ? "default" : "outline"}
                    size="sm"
                    className={`rounded-2xl px-5 py-1.5 ${item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                    onClick={() => handleSetCompleted(item, true)}
                    disabled={isUpdating && updatingItemId === item.id}
                  >
                    {isUpdating && updatingItemId === item.id ? (
                      <svg className="mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : 'Yes'}
                  </Button>
                  <Button
                    variant={!item.okStatus ? "default" : "outline"}
                    size="sm"
                    className={`rounded-2xl px-5 py-1.5 ${!item.okStatus ? 'bg-black text-white hover:bg-neutral-900' : ''}`}
                    onClick={() => handleSetCompleted(item, false)}
                    disabled={isUpdating && updatingItemId === item.id}
                  >
                    {isUpdating && updatingItemId === item.id ? (
                      <svg className="mr-2 w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                    ) : 'No'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>

      {/* Settings modal (if needed) */}
      {settingsOpen && (
        <QCChecklistSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          workfileId={workfile.id}
          qualityCheckId={qualityCheck?.id || ''}
          checklist={checks}
          // status={qualityCheck?.status as QualityControlStatus}
          modalProps={{
            closeOnBackdrop: false
          }}
        />
      )}
    </div>
  )
}
