'use client'

import * as React from 'react'
import { ChevronDown, User } from 'lucide-react'
import { createPortal } from 'react-dom'

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
  options: Option[]
  placeholder?: string
  selectedValues?: string[]
  onChange?: (value: string[]) => void
  multiSelect?: boolean
  value?: string[]
  error?: string
  label?: string
}

export function CustomSelect({
  options,
  placeholder = 'Select...',
  selectedValues,
  onChange,
  multiSelect = false,
  value = [],
  error,
  label
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalSelectedValues, setInternalSelectedValues] = React.useState<string[]>(value)
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const [dropdownStyle, setDropdownStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        buttonRef.current &&
        dropdownRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownStyle({
        position: 'fixed',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    let newValues: string[]
    if (multiSelect) {
      if (internalSelectedValues.includes(optionValue)) {
        newValues = internalSelectedValues.filter((v) => v !== optionValue)
      } else {
        newValues = [...internalSelectedValues, optionValue]
      }
    } else {
      newValues = [optionValue]
    }
    setInternalSelectedValues(newValues)
    onChange?.(newValues)
    if (!multiSelect) {
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
        className={cn(
          'w-full px-4 py-2 h-10 text-left rounded-full bg-[#E3E3E3] flex items-center justify-between',
          'focus:outline-none'
        )}
      >
        <span className="flex items-center gap-2 font-medium text-sm">
          {internalSelectedValues.length > 0 ? (
            multiSelect ? (
              `${internalSelectedValues.length} selected`
            ) : (
              <>
                {options.find((opt) => opt.value === internalSelectedValues[0])
                  ?.avatar && (
                  <Avatar className="h-6 w-6  text-black">
                    <AvatarImage
                      src={
                        options.find((opt) => opt.value === internalSelectedValues[0])
                          ?.avatar
                      }
                      alt={
                        options.find((opt) => opt.value === internalSelectedValues[0])
                          ?.label || ''
                      }
                    />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                {options.find((opt) => opt.value === internalSelectedValues[0])?.label}
              </>
            )
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            ' h-4 w-4 transition-transform',
            isOpen && 'rotate-180',
            internalSelectedValues?.length > 0 && !multiSelect
              ? 'text-black'
              : 'text-gray-500'
          )}
        />
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="fixed bg-[#E3E3E3] rounded-2xl shadow-lg z-[99999]"
          >
            <div className="max-h-[280px] overflow-y-auto">
              {options.map((opt) => (
                <div
                  key={opt.value}
                  data-option
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSelect(opt.value)
                  }}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-4 py-2 text-sm hover:opacity-80',
                    (internalSelectedValues || []).includes(opt.value) &&
                      !multiSelect &&
                      'bg-black text-white'
                  )}
                >
                  {multiSelect && (
                    <Checkbox
                      checked={(internalSelectedValues || []).includes(opt.value)}
                      className="h-4 w-4 border-gray-400 rounded-[4px]"
                    />
                  )}
                  {opt.avatar && (
                    <Avatar className="h-6 w-6 text-black">
                      <AvatarImage src={opt.avatar} alt={opt.label} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  {opt.label}
                </div>
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
