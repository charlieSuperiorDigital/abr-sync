'use client'

import { useCustomCheckMutations, useUpdateQualityCheckItem } from '@/app/api/hooks/useQualityCheck'
import { QualityCheckItem } from '@/app/types/quality-check'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import * as React from 'react'
import QCFieldEditModal from './qc-field-edit-modal'

interface QCChecklistSettingsModalProps {
  open: boolean
  onClose: () => void
  workfileId: string
  qualityCheckId: string
  checklist: QualityCheckItem[]
  // status: QualityControlStatus
  modalProps?: {
    closeOnBackdrop?: boolean
  }
}

export default function QCChecklistSettingsModal({
  open,
  onClose,
  workfileId,
  qualityCheckId,
  checklist,
  // status,
  modalProps,
}: QCChecklistSettingsModalProps) {
  const { addCustomCheck, isAddingCheck, deleteCustomCheck, isDeletingCheck } = useCustomCheckMutations();
  const { updateItem, isLoading: isUpdatingItem } = useUpdateQualityCheckItem();
  const [localChecklist, setLocalChecklist] = React.useState<QualityCheckItem[]>(checklist)
  const [editModalOpen, setEditModalOpen] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editingItem, setEditingItem] = React.useState<QualityCheckItem | null>(null)
  const [pendingAdd, setPendingAdd] = React.useState(false);
  const [loadingItemId, setLoadingItemId] = React.useState<string | null>(null);
  const [showLoadingOverlay, setShowLoadingOverlay] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)
  const [deletingItem, setDeletingItem] = React.useState<QualityCheckItem | null>(null)
  const [deleteLoading, setDeleteLoading] = React.useState(false)

  // Sync localChecklist with checklist prop when checklist changes (for instant UI after add)
  React.useEffect(() => {
    setLocalChecklist(checklist)
  }, [checklist])

  // Split checklist into default and custom fields
  const defaultFields = localChecklist.filter(item => item.defaultCheck);
  const customFields = localChecklist.filter(item => !item.defaultCheck);

  // --- Checkbox Optimistic Update State ---
  const [optimisticEnabledIds, setOptimisticEnabledIds] = React.useState<{ [id: string]: boolean }>({});
  const [updatingEnabledId, setUpdatingEnabledId] = React.useState<string | null>(null);

  // --- Optimistic Toggle Handler (fix: update localChecklist immediately for UI) ---
  const handleToggleEnabled = (index: number) => {
    const item = localChecklist[index];
    const newEnabled = !item.enabled;
    // Optimistically update localChecklist for instant UI feedback
    setLocalChecklist(prev => prev.map((it, i) => i === index ? { ...it, enabled: newEnabled } : it));
    setOptimisticEnabledIds(prev => ({ ...prev, [item.id]: newEnabled }));
    setUpdatingEnabledId(item.id);
    const updatedItem = {
      id: item.id,
      name: item.name,
      enabled: newEnabled,
      okStatus: item.okStatus,
      type: item.type,
      description: item.description,
      notes: item.notes,
    };
    setShowLoadingOverlay(true);
    updateItem(updatedItem, {
      onSettled: () => {
        setUpdatingEnabledId(null);
        setShowLoadingOverlay(false);
        setOptimisticEnabledIds(prev => {
          const copy = { ...prev };
          delete copy[item.id];
          return copy;
        });
      },
      onError: () => {
        // Revert localChecklist if mutation fails
        setLocalChecklist(prev => prev.map((it, i) => i === index ? { ...it, enabled: item.enabled } : it));
      }
    });
  };

  // --- Checkbox checked value ---
  const getChecked = (item: QualityCheckItem) => {
    if (optimisticEnabledIds.hasOwnProperty(item.id)) {
      return optimisticEnabledIds[item.id];
    }
    return item.enabled;
  };

  // Handle create custom field
  const handleCreateCustomField = (data: { title: string; description: string }) => {
    const tempId = `temp-${Date.now()}`;
    const body = {
      qualityCheckId: qualityCheckId,
      name: data.title,
      okStatus: false,
      type: 0,
      description: data.description,
      notes: "string",
      enabled: true,
      defaultCheck: false
    };
    // Optimistically add new item
    setLocalChecklist(prev => [
      ...prev,
      { ...body, id: tempId, images: [], performedBy: null, updatedAt: null }
    ]);
    setPendingAdd(true);
    addCustomCheck(body, {
      onSuccess: () => {
        setPendingAdd(false);
        setEditModalOpen(false);
      },
      onError: () => {
        setPendingAdd(false);
        // Remove the temp item if mutation fails
        setLocalChecklist(prev => prev.filter(item => item.id !== tempId));
      }
    });
  }

  // Handle edit custom field
  const handleEditCustomField = (data: { title: string; description: string }) => {
    if (!editingItem) return

    const updatedItem = {
      id: editingItem.id,
      name: data.title,
      description: data.description,
      enabled: editingItem.enabled,
      okStatus: editingItem.okStatus,
      type: editingItem.type,
      notes: editingItem.notes,
    };
    updateItem(updatedItem);
    setEditingItem(null)
  }

  // Handle delete custom field
  const handleDeleteClick = (item: QualityCheckItem) => {
    setDeletingItem(item)
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!deletingItem) return;
    setDeleteLoading(true)
    deleteCustomCheck({
      qualityCheckItemId: deletingItem.id
    }, {
      onSuccess: () => {
        setDeleteLoading(false)
        setDeleteModalOpen(false)
        setDeletingItem(null)
      },
      onError: () => {
        setDeleteLoading(false)
      }
    })
  }

  // Save changes
  const handleSaveQcChanges = () => {
    console.log('Current QC items:', localChecklist)
    onClose()
  }

  const handleEditClick = (item: QualityCheckItem) => {
    setEditingItem(item)
    setIsEditing(true)
    setEditModalOpen(true)
  }

  // --- Edit Modal Initial Data ---
  const getEditInitialData = () => {
    if (!isEditing || !editingItem) return undefined;
    return {
      title: editingItem.name,
      description: editingItem.description || '',
      enabled: editingItem.enabled
    };
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={setEditModalOpen}
        // Prevent closing on backdrop click if closeOnBackdrop is false
        modal={true}
        {...(modalProps?.closeOnBackdrop === false ? { onInteractOutside: (e: Event) => e.preventDefault() } : {})}
      >
        <DialogContent
          className="sm:max-w-[425px] relative flex flex-col items-center justify-center min-h-[300px] min-w-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {showLoadingOverlay && (
            <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/70">
              <div className="flex flex-col gap-2 items-center">
                <svg className="w-8 h-8 text-gray-800 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span className="font-medium text-gray-700 text-md">Updating item...</span>
              </div>
            </div>
          )}
          {pendingAdd && (
            <div className="flex absolute inset-0 z-50 justify-center items-center bg-white/70">
              <div className="flex flex-col gap-2 items-center">
                <svg className="w-8 h-8 text-gray-800 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span className="font-medium text-gray-700 text-md">Creating item...</span>
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
                      checked={getChecked(item)}
                      disabled={updatingEnabledId === item.id || showLoadingOverlay}
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Custom Fields</h3>
                <button
                  type="button"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                  onClick={() => { setIsEditing(false); setEditModalOpen(true); }}
                  title="Add Custom Field"
                >
                  <Plus className="w-5 h-5" color="black" />
                </button>
              </div>
              <ul className="space-y-1">
                {customFields.map((item, idx) => (
                  <li key={item.id} className="flex gap-1 items-center hover:bg-gray-200">
                    <Checkbox
                      id={`custom-${idx}`}
                      checked={getChecked(item)}
                      disabled={updatingEnabledId === item.id || showLoadingOverlay}
                      onCheckedChange={() => handleToggleEnabled(localChecklist.indexOf(item))}
                    />
                    <label
                      htmlFor={`custom-${idx}`}
                      className="text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.name}
                    </label>
                    <div className="flex gap-3 ml-auto">
                      <button onClick={() => handleEditClick(item)} className="p-1 rounded hover:bg-gray-400" aria-label="Edit">
                        <Pencil className="w-4 h-4 text-black" />
                      </button>
                      <button onClick={() => handleDeleteClick(item)} className="p-1 rounded hover:bg-gray-400" aria-label="Delete">
                        <Trash2 className="w-4 h-4 text-black" />
                      </button>
                    </div>
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
        initialData={getEditInitialData()}
        onSave={data => {
          if (!isEditing) {
            setPendingAdd(true);
            handleCreateCustomField(data);
          } else {
            handleEditCustomField(data);
          }
        }}
      />

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-3">Are you sure you want to delete <span className="font-semibold">{deletingItem?.name}</span>?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? (
                <svg className="inline-block mr-2 w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
