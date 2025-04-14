'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { QualityControlStatus } from '@/app/types/workfile'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import QCFieldEditModal from './qc-field-edit-modal'
import { QualityCheckItem } from '@/app/types/quality-check'
import { useCustomCheckMutations } from '@/app/api/hooks/useQualityCheck'

interface QCChecklistSettingsModalProps {
  open: boolean
  onClose: () => void
  workfileId: string
  qualityCheckId: string
  checklist: QualityCheckItem[]
  status: QualityControlStatus
}

export default function QCChecklistSettingsModal({
  open,
  onClose,
  workfileId,
  qualityCheckId,
  checklist,
  status,
}: QCChecklistSettingsModalProps) {
  const { updateWorkfile } = useWorkfileStore()
  const { addCustomCheck, isAddingCheck } = useCustomCheckMutations();
  const [localChecklist, setLocalChecklist] = React.useState<QualityCheckItem[]>(checklist)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<QualityCheckItem | null>(null)
  const [pendingAdd, setPendingAdd] = React.useState(false);

  // Split checklist into standard and custom fields
  // const standardFields = localChecklist.filter(item => !item.isCustomField)
  // const customFields = localChecklist.filter(item => item.isCustomField)
  // For now, list all items as standard fields
  const standardFields = localChecklist;
  // const customFields: QualityCheckItem[] = [];

  // Handle toggling a checklist item's enabled state
  const handleToggleEnabled = (index: number) => {
    const newChecklist = [...localChecklist]
    newChecklist[index] = {
      ...newChecklist[index],
      enabled: !newChecklist[index].enabled
    }
    setLocalChecklist(newChecklist)
  }

  // Handle create custom field
  const handleCreateCustomField = (data: { title: string; description: string }) => {
    const newField: QualityCheckItem = {
      title: data.title,
      description: data.description,
      completed: false,
      enabled: true,
      isCustomField: true
    }
    const newChecklist = [...localChecklist, newField]
    setLocalChecklist(newChecklist)

    // Update workfile with new checklist
    if (status !== QualityControlStatus.AWAITING) {
      updateWorkfile(workfileId, {
        qualityControl: {
          status,
          checklist: newChecklist
        }
      })
    } else {
      // Create a new quality control object if it doesn't exist
      updateWorkfile(workfileId, {
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

  // Handle edit custom field
  const handleEditCustomField = (data: { title: string; description: string }) => {
    if (!editingItem) return
    
    const newChecklist = localChecklist.map(item => 
      item === editingItem 
        ? { ...item, title: data.title, description: data.description }
        : item
    )
    setLocalChecklist(newChecklist)
    setEditingItem(null)

    // Update workfile with edited checklist
    if (status !== QualityControlStatus.AWAITING) {
      updateWorkfile(workfileId, {
        qualityControl: {
          status,
          checklist: newChecklist
        }
      })
    } else {
      // Create a new quality control object if it doesn't exist
      updateWorkfile(workfileId, {
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

  // Handle delete custom field
  const handleDeleteCustomField = (item: QualityCheckItem) => {
    const newChecklist = localChecklist.filter(field => field !== item)
    setLocalChecklist(newChecklist)

    // Update workfile with filtered checklist
    if (status !== QualityControlStatus.AWAITING) {
      updateWorkfile(workfileId, {
        qualityControl: {
          status,
          checklist: newChecklist
        }
      })
    } else {
      // Create a new quality control object if it doesn't exist
      updateWorkfile(workfileId, {
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

  // Save changes
  const handleSaveQcChanges = () => {
    console.log('Current QC items:', localChecklist)
    
    // Update workfile with new checklist
    if (status !== QualityControlStatus.AWAITING) {
      updateWorkfile(workfileId, {
        qualityControl: {
          status,
          checklist: localChecklist
        }
      })
    } else {
      // Create a new quality control object if it doesn't exist
      updateWorkfile(workfileId, {
        qualityControl: {
          status: QualityControlStatus.AWAITING,
          checklist: localChecklist,
          completionDate: undefined,
          completedBy: undefined,
          assignedTo: undefined
        }
      })
    }
    onClose()
  }

  const handleEditClick = (item: QualityCheckItem) => {
    setEditingItem(item)
    setIsEditing(true)
    setEditModalOpen(true)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>QC Checklist Settings</DialogTitle>
            <DialogDescription>
              Configure which quality control items should be shown in the checklist.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="mb-6">
              <h3 className="mb-2 font-semibold text-md">Standard Fields</h3>
              <ul className="space-y-2">
                {standardFields.map((item, idx) => (
                  <li key={item.id} className="flex gap-2 items-center">
                    <Checkbox
                      id={`standard-${idx}`}
                      checked={item.enabled}
                      onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                    />
                    <label
                      htmlFor={`standard-${idx}`}
                      className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => setEditModalOpen(true)}
              disabled={isAddingCheck}
            >
              <Plus className="mr-1 w-4 h-4" />
              {isAddingCheck ? (
                <svg className="w-4 h-4 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                'Add New'
              )}
            </Button>
            <Button onClick={handleSaveQcChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QCFieldEditModal
        open={editModalOpen}
        onOpenChange={open => {
          if (!isAddingCheck) setEditModalOpen(open);
        }}
        title={isEditing ? "Edit Field" : "Add Field"}
        initialData={isEditing && editingItem ? { title: editingItem.name, description: editingItem.description || '' } : undefined}
        onSave={data => {
          if (!isEditing) {
            const body = {
              qualityCheckId: qualityCheckId,
              name: data.title,
              description: data.description,
              okStatus: false,
              type: 0,
              notes: "string",
              performedBy: ""
            };
            console.log('addCustomCheck body:', body);
            setPendingAdd(true);
            addCustomCheck(body, {
              onSuccess: () => {
                setPendingAdd(false);
                setEditModalOpen(false);
              },
              onError: () => {
                setPendingAdd(false);
              }
            });
          } else {
            handleEditCustomField(data);
          }
        }}
      />
    </>
  )
}
