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
import { useCustomCheckMutations, useUpdateQualityCheckItem } from '@/app/api/hooks/useQualityCheck'

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
  const { updateItem, isLoading: isUpdatingItem } = useUpdateQualityCheckItem();
  const [localChecklist, setLocalChecklist] = React.useState<QualityCheckItem[]>(checklist)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<QualityCheckItem | null>(null)
  const [pendingAdd, setPendingAdd] = React.useState(false);
  const [loadingItemId, setLoadingItemId] = React.useState<string | null>(null);
  const [showLoadingOverlay, setShowLoadingOverlay] = React.useState(false);

  // Split checklist into default and custom fields
  const defaultFields = localChecklist.filter(item => item.defaultCheck);
  const customFields = localChecklist.filter(item => !item.defaultCheck);

  // Handle toggling a checklist item's enabled state
  const handleToggleEnabled = async (index: number) => {
    const item = localChecklist[index];
    const updatedItem = {
      id: item.id,
      name: item.name,
      enabled: !item.enabled,
      okStatus: item.okStatus,
      type: item.type,
      description: item.description,
      notes: item.notes,
    };
    setLoadingItemId(item.id);
    setShowLoadingOverlay(true);
    updateItem(updatedItem, {
      onSettled: () => {
        setLoadingItemId(null);
        setShowLoadingOverlay(false);
      }
    });
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
        <DialogContent className="sm:max-w-[425px] relative">
          {showLoadingOverlay && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
              <div className="flex flex-col items-center gap-2">
                <svg className="w-8 h-8 animate-spin text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span className="text-md font-medium text-gray-700">Updating item...</span>
              </div>
            </div>
          )}
          <DialogHeader>
            <DialogTitle>QC Checklist Settings</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="mb-6">

              <ul className="space-y-2">
                {defaultFields.map((item, idx) => (
                  <li key={item.id} className="flex gap-2 items-center">
                    <Checkbox
                      id={`default-${idx}`}
                      checked={item.enabled}
                      onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                    />
                    <label
                      htmlFor={`default-${idx}`}
                      className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-md">Custom Fields</h3>
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => { setIsEditing(false); setEditModalOpen(true); }}
                  title="Add Custom Field"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <ul className="space-y-2">
                {customFields.map((item, idx) => (
                  <li key={item.id} className="flex gap-2 items-center">
                    <Checkbox
                      id={`custom-${idx}`}
                      checked={item.enabled}
                      onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                    />
                    <label
                      htmlFor={`custom-${idx}`}
                      className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                    {/* Optionally, add edit/delete icons for custom fields here */}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
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
