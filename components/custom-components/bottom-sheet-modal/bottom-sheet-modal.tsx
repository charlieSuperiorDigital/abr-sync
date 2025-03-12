'use client'

import * as React from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface BottomSheetModalProps {
  children: React.ReactNode
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  title: string
}

export default function BottomSheetModal({
  children,
  isOpen,
  onOpenChange,
  title,
}: BottomSheetModalProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        onDoubleClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'p-0 transition-all duration-300 ease-in-out',
          'rounded-t-xl overflow-hidden',
          isExpanded ? 'h-[95vh]' : 'h-[50vh]'
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="p-6 h-full overflow-auto">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          <div
            className={cn(
              'transition-all duration-300',
              isExpanded ? 'h-auto' : 'h-[100%] overflow-hidden'
            )}
          >
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
