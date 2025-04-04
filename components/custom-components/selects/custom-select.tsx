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
  isDisabled?: boolean
}

export function CustomSelect({
  placeholder = 'Select...',
  options,
  onChange,
  multiSelect = false,
  value = [],
  isDisabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValues, setSelectedValues] = React.useState<string[]>(value)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [internalOptions, setInternalOptions] = React.useState<Option[]>(options)

  // Update internal options when options prop changes
  React.useEffect(() => {
    console.log('Options changed in CustomSelect:', options)
    setInternalOptions(options)
  }, [options])

  // Update selected values when value prop changes
  React.useEffect(() => {
    setSelectedValues(value)
  }, [value])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-2 text-left rounded-full bg-[#E3E3E3] flex items-center justify-between',
          'focus:outline-none',
          isDisabled && 'opacity-70 cursor-not-allowed'
        )}
        disabled={isDisabled}
      >
        <span className="flex items-center gap-2">
          {selectedValues.length > 0 ? (
            multiSelect ? (
              `${selectedValues.length} selected`
            ) : (
              <>
                {internalOptions.find((opt) => opt.value === selectedValues[0])
                  ?.avatar && (
                  <Avatar className="h-6 w-6  text-black">
                    <AvatarImage
                      src={
                        internalOptions.find((opt) => opt.value === selectedValues[0])
                          ?.avatar
                      }
                      alt={
                        internalOptions.find((opt) => opt.value === selectedValues[0])
                          ?.label || ''
                      }
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {internalOptions.find((opt) => opt.value === selectedValues[0])?.label}
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
      {isOpen && !isDisabled && (
        <div className="absolute z-50 w-full mt-1 bg-[#E3E3E3] rounded-2xl shadow-lg">
          <div className="max-h-[280px] overflow-y-auto py-2">
            {internalOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No options available</div>
            ) : (
              internalOptions.map((option) => (
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
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
