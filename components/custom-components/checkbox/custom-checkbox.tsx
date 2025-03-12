'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'

type CustomCheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  variant?: 'default' | 'error' | 'disabled'
  label?: React.ReactNode
  error?: string
}

export const CustomCheckbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CustomCheckboxProps
>(
  (
    {
      className,
      variant = 'default',
      label,
      error,
      checked,
      onCheckedChange,
      ...props
    },
    ref
  ) => (
    <div className="flex items-start space-x-2">
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          {
            'border-input bg-background hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground':
              variant === 'default',
            'border-red-500 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500 data-[state=checked]:text-white':
              variant === 'error',
            'border-gray-200 bg-gray-100':
              variant === 'disabled' || props.disabled,
          },
          className
        )}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn('flex items-center justify-center text-current')}
        >
          <Check className="h-3 w-3" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor={props.id}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error ? 'text-red-500' : 'text-gray-900'
            )}
          >
            {label}
          </label>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
      )}
    </div>
  )
)
CustomCheckbox.displayName = 'CustomCheckbox'
