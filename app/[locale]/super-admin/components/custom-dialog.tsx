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
        className={`sm:max-w-[600px] p-0 border-none bg-[#f9f9f9] rounded-3xl overflow-visible ${className}`}
      >
        <div className="relative p-8">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-8 top-8 text-black hover:text-gray-700"
          >
            <X size={24} />
            <span className="sr-only">Close</span>
          </button>

          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}
