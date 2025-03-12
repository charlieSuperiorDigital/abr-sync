'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ColorOption {
  id: string
  color: string
  bgClass: string
}

const colors: ColorOption[] = [
  { id: 'purple', color: 'Purple', bgClass: 'bg-purple-600' },
  { id: 'blue', color: 'Blue', bgClass: 'bg-blue-600' },
  { id: 'red', color: 'Red', bgClass: 'bg-red-600' },
  { id: 'orange', color: 'Orange', bgClass: 'bg-orange-500' },
  { id: 'green', color: 'Green', bgClass: 'bg-green-600' },
  { id: 'pink', color: 'Pink', bgClass: 'bg-pink-500' },
]

interface ColorPickerProps {
  rowCount?: number
  onChange?: (rowIndex: number, colorId: string) => void
  defaultSelections?: string[]
}

export function ColorPicker({
  rowCount = 7,
  onChange,
  defaultSelections,
}: ColorPickerProps) {
  const [selectedColors, setSelectedColors] = React.useState<string[]>(
    defaultSelections || Array(rowCount).fill(colors[0].id)
  )

  const handleColorSelect = (rowIndex: number, colorId: string) => {
    const newSelections = [...selectedColors]
    newSelections[rowIndex] = colorId
    setSelectedColors(newSelections)
    onChange?.(rowIndex, colorId)
  }

  return (
    <div className="p-6 rounded-3xl space-y-4">
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 justify-center">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorSelect(rowIndex, color.id)}
              className={cn(
                'w-8 h-8 rounded-full transition-all relative',
                selectedColors[rowIndex] === color.id
                  ? 'bg-white border-2 border-black' // Added black border for selected state
                  : cn(color.bgClass, 'hover:scale-110')
              )}
              aria-label={`Select ${color.color}`}
            >
              {selectedColors[rowIndex] === color.id && (
                <div
                  className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full', // Reduced size to w-4 h-4
                    color.bgClass
                  )}
                />
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
