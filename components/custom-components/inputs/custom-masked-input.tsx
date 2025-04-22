'use client'

import React, { ChangeEvent } from 'react'
import { CustomInput } from './custom-input'

interface CustomMaskedInputProps extends Omit<React.ComponentProps<typeof CustomInput>, 'onChange' | 'value'> {
  value: string
  onChange: (value: string) => void
  mask?: string
}

export function CustomMaskedInput({
  value,
  onChange,
  mask = '(999) 999-9999',
  ...props
}: CustomMaskedInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '')
    let formattedValue = ''

    if (mask === '(999) 999-9999') {
      // Format as phone number (XXX) XXX-XXXX
      if (inputValue.length <= 3) {
        formattedValue = inputValue
      } else if (inputValue.length <= 6) {
        formattedValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3)}`
      } else {
        formattedValue = `(${inputValue.slice(0, 3)}) ${inputValue.slice(3, 6)}-${inputValue.slice(6, 10)}`
      }
    }

    onChange(formattedValue)
  }

  return (
    <CustomInput
      {...props}
      value={value}
      onChange={handleChange}
      type="tel"
      maxLength={14} // (XXX) XXX-XXXX = 14 characters
    />
  )
}
