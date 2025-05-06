import { cn } from '@/lib/utils'
import { DialogTitle } from '@radix-ui/react-dialog'
import type * as React from 'react'

interface CustomDialogTitleProps {
  children: React.ReactNode
  icon?: string
  subtitle?: React.ReactNode
  className?: string
  alt?: string
}

export function CustomDialogTitle({
  children,
  icon,
  subtitle,
  className,
  alt = 'Icon',
}: CustomDialogTitleProps) {
  return (
    <div className={cn('flex items-center gap-1 h-[100px] ', className)}>
      {icon && (
        <div className="h-16 w-16 rounded-full flex items-center ">
          <img
            src={icon || '/placeholder.svg'}
            alt={alt}
            className="h-16 w-16 s rounded-full"
          />
        </div>
      )}
      <div>
        <DialogTitle className="text-3xl font-bold text-[#212326]">
          {children}
        </DialogTitle>
        {subtitle && (
          <div className="flex gap-6  text-[#707070]">{subtitle}</div>
        )}
      </div>
    </div>
  )
}
