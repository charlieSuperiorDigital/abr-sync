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
  value = '',  
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
          'relative flex items-center w-full h-[39px] rounded-full overflow-hidden',
          error && 'border-2 border-red-500'
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
            'w-full h-full pl-4 pr-10 text-sm outline-none text-right transition-colors duration-200 bg-[#E3E3E3]',
            error && 'text-red-500',
            className
          )}
          value={value} // Add value prop to input
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
