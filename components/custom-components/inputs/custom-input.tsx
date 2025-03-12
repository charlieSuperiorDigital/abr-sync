'use client'

import type React from 'react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function CustomInput({
  label,
  error,
  className,
  type,
  ref,
  id,
  ...props
}: CustomInputProps & { ref?: React.Ref<HTMLInputElement> }) {
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = type === 'password'
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="w-full space-y-2">
      <div
        className={cn(
          'relative flex items-center w-full h-[39px] rounded-full border-2 overflow-hidden',
          error && 'border-red-500'
        )}
      >
        <label
          htmlFor={inputId}
          className={cn(
            'absolute left-4 text-sm font-medium',
            error && 'text-red-500'
          )}
        >
          {label}
        </label>
        <input
          id={inputId}
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={cn(
            'w-full h-full px-4 py-2 text-sm focus:outline-none focus:ring-0 border-none text-right bg-[#D1D1D1]',
            'placeholder:text-gray-500 placeholder:font-bold',
            isPassword && 'pr-10',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

CustomInput.displayName = 'CustomInput'
