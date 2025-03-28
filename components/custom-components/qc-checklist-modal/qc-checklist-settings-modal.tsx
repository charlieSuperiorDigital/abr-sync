'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { QualityControlChecklistItem, QualityControlStatus } from '@/app/types/workfile'
import { useWorkfileStore } from '@/app/stores/workfile-store'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import QCFieldEditModal from './qc-field-edit-modal'

interface QCChecklistSettingsModalProps {
  open: boolean
  onClose: () => void
  workfileId: string
  checklist: QualityControlChecklistItem[]
  status: QualityControlStatus
}

export default function QCChecklistSettingsModal({
  open,
  onClose,
  workfileId,
  checklist,
  status,
}: QCChecklistSettingsModalProps) {
  const { updateWorkfile } = useWorkfileStore()
  const [localChecklist, setLocalChecklist] = React.useState<QualityControlChecklistItem[]>(checklist)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<QualityControlChecklistItem | null>(null)

  // Split checklist into standard and custom fields
  const standardFields = localChecklist.filter(item => !item.isCustomField)
  const customFields = localChecklist.filter(item => item.isCustomField)

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
    const newField: QualityControlChecklistItem = {
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
  const handleDeleteCustomField = (item: QualityControlChecklistItem) => {
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

  const handleEditClick = (item: QualityControlChecklistItem) => {
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
            <div className="grid gap-2">
              <h3 className="font-medium">Standard Fields</h3>
              {standardFields.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Checkbox
                    id={`standard-${index}`}
                    checked={item.enabled}
                    onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                  />
                  <label
                    htmlFor={`standard-${index}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {item.title}
                  </label>
                </div>
              ))}
            </div>

            <div className="grid gap-2">
              <h3 className="font-medium">Custom Fields</h3>
              {customFields.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id={`custom-${index}`}
                      checked={item.enabled}
                      onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                    />
                    <label
                      htmlFor={`custom-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.title}
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteCustomField(item)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditing(false)
                setEditModalOpen(true)
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New
            </Button>
            <Button onClick={handleSaveQcChanges}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <QCFieldEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        title={isEditing ? "Edit Area" : "Add New Area"}
        initialData={editingItem ? { 
          title: editingItem.title, 
          description: editingItem.description || '' 
        } : undefined}
        onSave={isEditing ? handleEditCustomField : handleCreateCustomField}
      />
    </>
  )
}
