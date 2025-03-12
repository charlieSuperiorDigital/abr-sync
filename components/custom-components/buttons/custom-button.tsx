'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'gray' | 'ghost' | 'underlined'
  onClick?: () => void
  loading?: boolean
}

export function CustomButton({
  className,
  variant = 'filled',
  onClick,
  loading = false,
  disabled,
  children,
  ...props
}: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'h-[40px] px-6 rounded-full text-sm font-medium transition-all relative',
        variant === 'filled' && 'bg-black text-white hover:bg-black/90',
        variant === 'outlined' &&
          'bg-white border-2 border-black text-black hover:bg-black/5',
        variant === 'gray' && 'bg-gray-400 text-white hover:bg-gray-500',
        variant === 'ghost' && 'bg-transparent text-black hover:bg-black/5',
        variant === 'underlined' &&
          'bg-transparent text-black underline underline-offset-4 hover:bg-black/5',
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin absolute left-3" />}
      <span className={cn(loading && 'opacity-0')}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          Loading...
        </span>
      )}
    </Button>
  )
}
