'use client'

import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface QCFieldEditModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  initialData?: {
    title: string
    description: string
  }
  onSave: (data: { title: string; description: string }) => void
}

export default function QCFieldEditModal({
  open,
  onOpenChange,
  title,
  initialData,
  onSave,
}: QCFieldEditModalProps) {
  const [fieldTitle, setFieldTitle] = React.useState(initialData?.title || '')
  const [description, setDescription] = React.useState(initialData?.description || '')

  const handleSave = () => {
    onSave({ title: fieldTitle, description })
    onOpenChange(false)
    setFieldTitle('')
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Name</Label>
            <Input
              id="title"
              value={fieldTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldTitle(e.target.value)}
              placeholder="Enter field name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Enter field description"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!fieldTitle.trim()}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
