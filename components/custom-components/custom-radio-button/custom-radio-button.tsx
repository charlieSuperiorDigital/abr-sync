'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'

import { cn } from '@/lib/utils'

const CustomRadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn('grid gap-2', className)}
      {...props}
      ref={ref}
    />
  )
})
CustomRadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const CustomRadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> & {
    variant?: 'default' | 'error' | 'disabled'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border transition-all',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        {
          'border-input bg-background text-primary hover:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-black data-[state=checked]:text-primary-foreground':
            variant === 'default',
          'border-red-500 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500':
            variant === 'error',
          'border-gray-400 bg-gray-300 cursor-not-allowed':
            variant === 'disabled' || props.disabled,
        },
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <div
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'disabled' || props.disabled
              ? 'bg-gray-400'
              : 'bg-white'
          )}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
CustomRadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { CustomRadioGroup, CustomRadioGroupItem }
