import { cn } from '@/lib/utils'
import React from 'react'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | 'default'
    | 'danger'
    | 'warning'
    | 'neutral'
    | 'slate'
    | 'info'
    | 'success'
    | 'forest'
    | 'dark'
  size?: 'sm' | 'md' | 'lg'
  width?: string
  height?: string
}

export function StatusBadge({
  variant = 'default',
  size = 'md',
  width,
  height,
  className,
  ...props
}: StatusBadgeProps) {
  return (
    <div
      style={{
        width: width,
        height: height,
      }}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition-colors',

        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-4 py-1 text-sm': size === 'md',
          'px-6 py-2 text-base': size === 'lg',
        },

        {
          'bg-red-600 text-white': variant === 'danger',
          'bg-[#F3D7D7] text-[#971010]': variant === 'warning',
          'bg-[#E3E3E3] text-white': variant === 'neutral',
          'bg-[#6E6E6E] text-white': variant === 'slate',
          'bg-blue-100 text-blue-800': variant === 'info',
          'bg-[#0F6C40] text-white': variant === 'success',
          'bg-[#C4E8D4] text-[#0F6C40]': variant === 'forest',
          'bg-black text-white': variant === 'dark',
        },
        className
      )}
      {...props}
    />
  )
}
