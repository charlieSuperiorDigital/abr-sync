'use client'

import * as React from 'react'
import { Workfile, QualityControlChecklistItem, QualityControlStatus } from '@/app/types/workfile'
import { Button } from '@/components/ui/button'
import { Upload, Check, X, Settings } from 'lucide-react'
import { formatDate } from '@/app/utils/date-utils'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import QCChecklistSettingsModal from './qc-checklist-settings-modal'

interface QCChecklistModalProps {
  workfile: Workfile
  onClose?: () => void
}

export default function QCChecklistModal({ workfile, onClose }: QCChecklistModalProps) {
  const { updateWorkfile } = useWorkfileStore()
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  // Expanded list of checklist items with enabled field
  const defaultChecklist: QualityControlChecklistItem[] = [
    { title: 'Repairs Completed', completed: false, enabled: true, isCustomField: false },
    { title: 'Initial Quality Control (QC) Performed', completed: false, enabled: true, isCustomField: false },
    { title: 'Reassembly Completed', completed: false, enabled: true, isCustomField: false },
    { title: 'Vehicle Detailed', completed: false, enabled: true, isCustomField: false },
    { title: 'Quality Control (QC) After Reassembly Completed', completed: false, enabled: true, isCustomField: false },
    { title: 'Work File Reconciled', completed: false, enabled: true, isCustomField: false },
    { title: 'Sublets', completed: false, enabled: true, isCustomField: false },
    { title: 'Final Review and Sign-off', completed: false, enabled: true, isCustomField: false },
    { title: 'Pre-Scan Completed', completed: false, enabled: true, isCustomField: false },
    { title: 'Post-Scan Completed', completed: false, enabled: true, isCustomField: false },
    { title: 'Paint Match Verified', completed: false, enabled: true, isCustomField: false },
    { title: 'Panel Alignment Checked', completed: false, enabled: true, isCustomField: false },
    { title: 'Gap Measurements Verified', completed: false, enabled: true, isCustomField: false },
    { title: 'Lights and Electronics Functioning', completed: false, enabled: true, isCustomField: false },
    { title: 'Wheel Alignment Verified', completed: false, enabled: true, isCustomField: false },
    { title: 'Interior Clean and Undamaged', completed: false, enabled: true, isCustomField: false },
    { title: 'Customer Belongings Returned', completed: false, enabled: true, isCustomField: false },
    { title: 'Final Wash Completed', completed: false, enabled: true, isCustomField: false },
    // Custom fields
    { title: 'Paint Booth Inspection', completed: false, enabled: true, isCustomField: true, description: 'Verify paint booth cleanliness and proper ventilation' },
    { title: 'Tool Calibration Check', completed: false, enabled: true, isCustomField: true, description: 'Ensure all measurement tools are properly calibrated' }
  ]

  // Use workfile's checklist if it exists, otherwise use default
  const checklist = workfile.qualityControl?.checklist || defaultChecklist

  // State to track the current checklist
  const [currentChecklist, setCurrentChecklist] = React.useState<QualityControlChecklistItem[]>(
    checklist.map(item => ({ 
      ...item, 
      enabled: item.enabled !== undefined ? item.enabled : true,
      completed: item.completed !== undefined ? item.completed : false 
    }))
  )

  // Update currentChecklist when workfile changes
  React.useEffect(() => {
    const updatedChecklist = workfile.qualityControl?.checklist || defaultChecklist
    setCurrentChecklist(
      updatedChecklist.map(item => ({ 
        ...item, 
        enabled: item.enabled !== undefined ? item.enabled : true,
        completed: item.completed !== undefined ? item.completed : false 
      }))
    )
  }, [workfile.qualityControl?.checklist])

  // State for uploaded files
  const [qcPhotosFile, setQCPhotosFile] = React.useState<File | null>(null)
  const [preScanFile, setPreScanFile] = React.useState<File | null>(null)
  const [postScanFile, setPostScanFile] = React.useState<File | null>(null)

  // File input references
  const qcPhotosInputRef = React.useRef<HTMLInputElement>(null)
  const preScanInputRef = React.useRef<HTMLInputElement>(null)
  const postScanInputRef = React.useRef<HTMLInputElement>(null)

  // Filter enabled items for display
  const enabledChecklist = currentChecklist.filter(item => item.enabled)

  // Check if all enabled items are completed
  const allItemsCompleted = React.useMemo(() => {
    return enabledChecklist.every(item => item.completed)
  }, [enabledChecklist])

  // Handle setting a checklist item to completed (Yes)
  const handleSetCompleted = (index: number, completed: boolean) => {
    const newChecklist = [...currentChecklist]
    newChecklist[index] = {
      ...newChecklist[index],
      completed,
      completionDate: completed ? new Date().toISOString() : undefined
    }

    setCurrentChecklist(newChecklist)

    // Update workfile with new checklist
    if (workfile.qualityControl) {
      updateWorkfile(workfile.workfileId, {
        qualityControl: {
          ...workfile.qualityControl,
          checklist: newChecklist
        }
      })
    } else {
      // Create a new quality control object if it doesn't exist
      updateWorkfile(workfile.workfileId, {
        qualityControl: {
          status: QualityControlStatus.AWAITING,
          checklist: newChecklist,
          completionDate: undefined,
          completedBy: undefined,
          assignedTo: undefined
        }
      })
    }
  }

  // Handle file uploads
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  // Handle marking QC as complete
  const handleMarkQCComplete = () => {
    // Double-check if all required items are completed
    if (allItemsCompleted) {
      if (workfile.qualityControl) {
        updateWorkfile(workfile.workfileId, {
          qualityControl: {
            ...workfile.qualityControl,
            status: QualityControlStatus.COMPLETED,
            completionDate: new Date().toISOString(),
            checklist: currentChecklist
          }
        })
      } else {
        // Create a new quality control object if it doesn't exist
        updateWorkfile(workfile.workfileId, {
          qualityControl: {
            status: QualityControlStatus.COMPLETED,
            checklist: currentChecklist,
            completionDate: new Date().toISOString(),
            completedBy: undefined,
            assignedTo: undefined
          }
        })
      }

      // Close the modal after completing the operation
      if (onClose) {
        onClose()
      }
    }
  }

  // Format date helper
  const formatDateWithTime = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={qcPhotosInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, setQCPhotosFile)}
        accept="image/*,.pdf"
      />
      <input
        type="file"
        ref={preScanInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, setPreScanFile)}
        accept="image/*,.pdf"
      />
      <input
        type="file"
        ref={postScanInputRef}
        className="hidden"
        onChange={(e) => handleFileChange(e, setPostScanFile)}
        accept="image/*,.pdf"
      />

      {/* Header with progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Quality Control Checklist</h2>
          <div className="flex gap-4">

            <Button
              variant="outline"
              size="icon"
              onClick={() => setSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <div className="flex justify-end mb-4">
              <Button
                onClick={handleMarkQCComplete}
                disabled={!allItemsCompleted}
                className="text-white bg-green-600 hover:bg-green-700"
              >
                Complete Quality Control
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-600 rounded-full"
            style={{
              width: `${(enabledChecklist.filter(item => item.completed).length / enabledChecklist.length) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {enabledChecklist.slice(0, Math.ceil(enabledChecklist.length / 2)).map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  {item.completed ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.completionDate && (
                    <div className="text-sm text-gray-500">
                      {formatDateWithTime(item.completionDate)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.completed ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${item.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => handleSetCompleted(enabledChecklist.indexOf(item), true)}
                >
                  Yes
                </Button>
                <Button
                  variant={!item.completed ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${!item.completed ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(enabledChecklist.indexOf(item), false)}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {enabledChecklist.slice(Math.ceil(enabledChecklist.length / 2)).map((item, index) => (
            <div key={index + Math.ceil(enabledChecklist.length / 2)} className="flex justify-between items-center">
              <div className="flex gap-3 items-center">
                <div className="flex justify-center items-center w-8 h-8">
                  {item.completed ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.completionDate && (
                    <div className="text-sm text-gray-500">
                      {formatDateWithTime(item.completionDate)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={item.completed ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${item.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => handleSetCompleted(enabledChecklist.indexOf(item), true)}
                >
                  Yes
                </Button>
                <Button
                  variant={!item.completed ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${!item.completed ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(enabledChecklist.indexOf(item), false)}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo upload section */}
      <div className="mt-8 space-y-4">


        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Quality Control Photos</h3>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => qcPhotosInputRef.current?.click()}
            >
              <Upload className="mr-1 w-4 h-4" />
              <span>Upload</span>
            </Button>
          </div>
          {qcPhotosFile && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Check className="mr-1 w-4 h-4 text-green-600" />
              {qcPhotosFile.name}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Pre Scan</h3>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => preScanInputRef.current?.click()}
            >
              <Upload className="mr-1 w-4 h-4" />
              <span>Upload</span>
            </Button>
          </div>
          {preScanFile && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Check className="mr-1 w-4 h-4 text-green-600" />
              {preScanFile.name}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Post Scan</h3>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => postScanInputRef.current?.click()}
            >
              <Upload className="mr-1 w-4 h-4" />
              <span>Upload</span>
            </Button>
          </div>
          {postScanFile && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <Check className="mr-1 w-4 h-4 text-green-600" />
              {postScanFile.name}
            </div>
          )}
        </div>
      </div>

      {settingsOpen && (
        <QCChecklistSettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          workfileId={workfile.workfileId}
          checklist={currentChecklist}
          status={workfile.qualityControl?.status || QualityControlStatus.AWAITING}
        />
      )}
    </div>
  )
}
