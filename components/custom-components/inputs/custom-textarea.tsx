'use client'

import type React from 'react'
import { cn } from '@/lib/utils'

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function CustomTextarea({
  label,
  error,
  className,
  id,
  rows = 4,
  ...props
}: CustomTextareaProps & { ref?: React.Ref<HTMLTextAreaElement> }) {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="w-full space-y-2">
      <div className="flex flex-col w-full">
        <label
          htmlFor={inputId}
          className={cn(
            'text-sm font-medium mb-1',
            error && 'text-red-500'
          )}
        >
          {label}
        </label>
        <textarea
          id={inputId}
          rows={rows}
          className={cn(
            'w-full p-3 text-sm outline-none rounded-md transition-colors duration-200 bg-[#E3E3E3]',
            error && 'border-2 border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

CustomTextarea.displayName = 'CustomTextarea'
