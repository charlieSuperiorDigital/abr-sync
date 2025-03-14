'use client'

import * as React from 'react'
import { ChevronDown, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'

export interface Option {
  value: string
  label: string
  avatar?: string
  selected?: boolean
}

interface CustomSelectProps {
  placeholder?: string
  options: Option[]
  onChange?: (value: string[]) => void
  multiSelect?: boolean
  value?: string[]
}

export function CustomSelect({
  placeholder = 'Select...',
  options,
  onChange,
  multiSelect = false,
  value = [],
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)

  const handleSelect = (optionValue: string) => {
    let newValues: string[]
    if (multiSelect) {
      if (selectedValues.includes(optionValue)) {
        newValues = selectedValues.filter((v) => v !== optionValue)
      } else {
        newValues = [...selectedValues, optionValue]
      }
    } else {
      newValues = [optionValue]
      setIsOpen(false)
    }
    setSelectedValues(newValues)
    onChange?.(newValues)
  }

  return (
    <div className="relative">
      <button
        type='button'
        onClick={() => {setIsOpen(!isOpen) }}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-[20px] border border-input bg-gray-100 px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          selectedValues.length > 0 && !multiSelect && 'bg-black text-white'
        )}
      >
        <span className="flex items-center gap-2">
          {selectedValues.length > 0 ? (
            multiSelect ? (
              `${selectedValues.length} selected`
            ) : (
              <>
                {options.find((opt) => opt.value === selectedValues[0])
                  ?.avatar && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={
                        options.find((opt) => opt.value === selectedValues[0])
                          ?.avatar
                      }
                      alt={
                        options.find((opt) => opt.value === selectedValues[0])
                          ?.label || ''
                      }
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {options.find((opt) => opt.value === selectedValues[0])?.label}
              </>
            )
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform',
            isOpen && 'rotate-180',
            selectedValues.length > 0 && !multiSelect
              ? 'text-white'
              : 'text-gray-500'
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-[20px] border bg-gray-100 py-1 shadow-lg">
          <div className="max-h-[280px] overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm',
                  selectedValues.includes(option.value) &&
                    !multiSelect &&
                    'bg-black text-white',
                  'hover:bg-gray-200'
                )}
              >
                {multiSelect && (
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    className="h-4 w-4 border-gray-400 rounded-[4px]"
                  />
                )}
                {option.avatar && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={option.avatar} alt={option.label} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
