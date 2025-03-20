'use client'

import * as React from 'react'
import { Workfile, QualityControlChecklistItem, QualityControlStatus } from '@/app/types/workfile'
import { Button } from '@/components/ui/button'
import { Upload, Check, X } from 'lucide-react'
import { formatDate } from '@/app/utils/date-utils'
import { useWorkfileStore } from '@/app/stores/workfile-store'

interface QCChecklistModalProps {
  workfile: Workfile
  onClose?: () => void
}

export default function QCChecklistModal({ workfile, onClose }: QCChecklistModalProps) {
  const { updateWorkfile } = useWorkfileStore()
  
  // Expanded list of checklist items
  const defaultChecklist: QualityControlChecklistItem[] = [
    { title: 'Repairs Completed', completed: false },
    { title: 'Initial Quality Control (QC) Performed', completed: false },
    { title: 'Reassembly Completed', completed: false },
    { title: 'Vehicle Detailed', completed: false },
    { title: 'Quality Control (QC) After Reassembly Completed', completed: false },
    { title: 'Work File Reconciled', completed: false },
    { title: 'Sublets', completed: false },
    { title: 'Final Review and Sign-off', completed: false },
    { title: 'Pre-Scan Completed', completed: false },
    { title: 'Post-Scan Completed', completed: false },
    { title: 'Paint Match Verified', completed: false },
    { title: 'Panel Alignment Checked', completed: false },
    { title: 'Gap Measurements Verified', completed: false },
    { title: 'Lights and Electronics Functioning', completed: false },
    { title: 'Wheel Alignment Verified', completed: false },
    { title: 'Interior Clean and Undamaged', completed: false },
    { title: 'Customer Belongings Returned', completed: false },
    { title: 'Final Wash Completed', completed: false }
  ]

  // Use workfile's checklist if it exists, otherwise use default
  const checklist = workfile.qualityControl?.checklist || defaultChecklist
  
  // State to track the current checklist
  const [currentChecklist, setCurrentChecklist] = React.useState<QualityControlChecklistItem[]>(checklist)
  
  // State for uploaded files
  const [qcPhotosFile, setQCPhotosFile] = React.useState<File | null>(null)
  const [preScanFile, setPreScanFile] = React.useState<File | null>(null)
  const [postScanFile, setPostScanFile] = React.useState<File | null>(null)
  
  // File input references
  const qcPhotosInputRef = React.useRef<HTMLInputElement>(null)
  const preScanInputRef = React.useRef<HTMLInputElement>(null)
  const postScanInputRef = React.useRef<HTMLInputElement>(null)
  
  // Check if all items are completed
  const allItemsCompleted = React.useMemo(() => {
    return currentChecklist.every(item => item.completed)
  }, [currentChecklist])

  // Handle setting a checklist item to completed (Yes)
  const handleSetCompleted = (index: number, completed: boolean) => {
    const newChecklist = [...currentChecklist]
    newChecklist[index] = {
      ...newChecklist[index],
      completed: completed,
      date: completed ? new Date().toISOString() : undefined
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
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Quality Control</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <span className="mr-1">Settings</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className={`rounded-full ${
                allItemsCompleted 
                  ? 'bg-black text-white hover:bg-gray-800' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
              }`}
              onClick={handleMarkQCComplete}
              disabled={!allItemsCompleted}
            >
              <span className="mr-1">Mark QC as complete</span>
            </Button>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full" 
            style={{ 
              width: `${(currentChecklist.filter(item => item.completed).length / currentChecklist.length) * 100}%` 
            }}
          ></div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {currentChecklist.slice(0, Math.ceil(currentChecklist.length / 2)).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {item.completed ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.date && (
                    <div className="text-sm text-gray-500">
                      {formatDateWithTime(item.date)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={item.completed ? "default" : "outline"} 
                  size="sm" 
                  className={`rounded-full ${item.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => handleSetCompleted(index, true)}
                >
                  Yes
                </Button>
                <Button 
                  variant={!item.completed ? "default" : "outline"} 
                  size="sm" 
                  className={`rounded-full ${!item.completed ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(index, false)}
                >
                  No
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {currentChecklist.slice(Math.ceil(currentChecklist.length / 2)).map((item, index) => (
            <div key={index + Math.ceil(currentChecklist.length / 2)} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center">
                  {item.completed ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.date && (
                    <div className="text-sm text-gray-500">
                      {formatDateWithTime(item.date)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={item.completed ? "default" : "outline"} 
                  size="sm" 
                  className={`rounded-full ${item.completed ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => handleSetCompleted(index + Math.ceil(currentChecklist.length / 2), true)}
                >
                  Yes
                </Button>
                <Button 
                  variant={!item.completed ? "default" : "outline"} 
                  size="sm" 
                  className={`rounded-full ${!item.completed ? 'bg-gray-600 hover:bg-gray-700' : ''}`}
                  onClick={() => handleSetCompleted(index + Math.ceil(currentChecklist.length / 2), false)}
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
              <Upload className="h-4 w-4 mr-1" />
              <span>Upload</span>
            </Button>
          </div>
          {qcPhotosFile && (
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
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
              <Upload className="h-4 w-4 mr-1" />
              <span>Upload</span>
            </Button>
          </div>
          {preScanFile && (
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
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
              <Upload className="h-4 w-4 mr-1" />
              <span>Upload</span>
            </Button>
          </div>
          {postScanFile && (
            <div className="mt-2 text-sm text-gray-600 flex items-center">
              <Check className="h-4 w-4 mr-1 text-green-600" />
              {postScanFile.name}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
