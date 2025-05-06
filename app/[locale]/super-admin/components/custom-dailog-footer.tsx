'use client'
import { Button } from '@/components/ui/button'

interface CustomDialogFooterProps {
  onCancel: () => void
  onSave: () => void
  cancelText?: string
  saveText?: string
  className?: string
}

export function CustomDialogFooter({
  onCancel,
  onSave,
  cancelText = 'Cancel',
  saveText = 'Save',
  className = '',
}: CustomDialogFooterProps) {
  return (
    <div className={`flex gap-4 ${className}`}>
      <Button
        variant="outline"
        className="flex-1 py-6 text-lg rounded-full border-2 border-[#e3e3e3] bg-white hover:bg-gray-50"
        onClick={onCancel}
      >
        {cancelText}
      </Button>
      <Button
        className="flex-1 py-6 text-lg rounded-full bg-[#212326] hover:bg-black text-white"
        onClick={onSave}
      >
        {saveText}
      </Button>
    </div>
  )
}
