'use client'

import type * as React from 'react'
import { X } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'

interface CustomDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

export function CustomDialog({
  isOpen,
  onOpenChange,
  children,
  className = '',
}: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`w-full  max-w-[750px] p-0 border-none bg-[#f9f9f9] rounded-3xl overflow-visible ${className}`}
      >
        <div className="relative p-8">{children}</div>
      </DialogContent>
    </Dialog>
  )
}
