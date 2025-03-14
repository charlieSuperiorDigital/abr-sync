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
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = React.useState<number | null>(null)
  
  // Update content height when content changes or when modal opens
  React.useEffect(() => {
    if (isOpen && contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        if (contentRef.current) {
          // Get the scrollHeight of the content
          const height = contentRef.current.scrollHeight
          setContentHeight(height)
        }
      })
      
      resizeObserver.observe(contentRef.current)
      
      return () => {
        if (contentRef.current) {
          resizeObserver.unobserve(contentRef.current)
        }
      }
    }
  }, [isOpen, children])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        onDoubleClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'p-0 transition-all duration-300 ease-in-out',
          'rounded-t-xl overflow-hidden',
          isExpanded 
            ? 'h-[95vh]' 
            : contentHeight 
              ? `max-h-[80vh] h-auto` 
              : 'h-[50vh]'
        )}
        style={
          !isExpanded && contentHeight 
            ? { 
                height: `${Math.min(contentHeight + 100, window.innerHeight * 0.8)}px`,
              } 
            : {}
        }
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="p-6 h-full overflow-auto">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
          <div
            ref={contentRef}
            className={cn(
              'transition-all duration-300',
              isExpanded ? 'h-auto' : 'h-auto'
            )}
          >
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
