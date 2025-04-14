'use client'

import * as React from 'react'
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form'

interface CustomButtonSelectProps<T extends string> {
  options: readonly T[]
  value?: T | T[]
  onChange: (value: T | T[]) => void
  multiple?: boolean
}

const buttonStyles = {
  base: "px-4 py-2 w-full text-center",
  selected: "bg-black text-white rounded-full",
  unselected: ""
}

export function CustomButtonSelect<T extends string>({
  options,
  value,
  onChange,
  multiple = false
}: CustomButtonSelectProps<T>) {
  const handleOptionClick = (option: T) => {
    if (multiple) {
      const currentValue = (value || []) as T[]
      const newValue = currentValue.includes(option)
        ? currentValue.filter(v => v !== option)
        : [...currentValue, option]
      onChange(newValue)
    } else {
      onChange(option)
    }
  }

  const isSelected = (option: T) => {
    if (multiple) {
      return ((value || []) as T[]).includes(option)
    }
    return value === option
  }

  return (
    <div className="bg-[#E3E3E3] rounded-full flex">
      {options.map((option, index) => (
        <button
          key={option}
          type="button"
          onClick={() => handleOptionClick(option)}
          className={`${buttonStyles.base} ${
            isSelected(option)
              ? buttonStyles.selected
              : buttonStyles.unselected
          } ${index === 0 ? 'rounded-l-full' : ''} ${
            index === options.length - 1 ? 'rounded-r-full' : ''
          }`}
        >
          {typeof option === 'string' && option.length <= 3
            ? option.slice(0, 3)
            : option}
        </button>
      ))}
    </div>
  )
}

export function CustomButtonSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>
>({
  field,
  options,
  multiple = false
}: {
  field: ControllerRenderProps<TFieldValues, TName>
  options: readonly string[]
  multiple?: boolean
}) {
  return (
    <CustomButtonSelect
      options={options}
      value={field.value}
      onChange={field.onChange}
      multiple={multiple}
    />
  )
}
