'use client'

import * as React from 'react'

import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'

interface ColorPickerInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  disabled?: boolean
  error?: string
}

export const ColorPickerInput = ({
  value = '#000000',
  onChange,
  label,
  disabled = false,
  error,
}: ColorPickerInputProps) => {
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    // Validate hex color before calling onChange
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      onChange?.(newValue)
    }
  }

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={inputValue}
            onChange={handleColorChange}
            disabled={disabled}
            className="border-input h-9 w-16 cursor-pointer rounded-md border disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <Input
          type="text"
          value={inputValue}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="#000000"
          className="flex-1"
          maxLength={7}
        />
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
