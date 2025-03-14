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
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-2 text-left rounded-full bg-[#E3E3E3] flex items-center justify-between',
          'focus:outline-none'
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
                  <Avatar className="h-6 w-6  text-black">
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
        <div className="absolute z-10 w-full mt-1 bg-[#E3E3E3] rounded-2xl shadow-lg">
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
                  'hover:opacity-80'
                )}
              >
                {multiSelect && (
                  <Checkbox
                    checked={selectedValues.includes(option.value)}
                    className="h-4 w-4 border-gray-400 rounded-[4px]"
                  />
                )}
                {option.avatar && (
                  <Avatar className="h-6 w-6 text-black">
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
