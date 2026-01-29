'use client'

import * as React from 'react'

import { IconEye, IconEyeOff } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import { Input } from '@/shared/ui/base/input'
import { Label } from '@/shared/ui/base/label'

interface SecretInputProps {
  value?: string
  onChange?: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  isMasked?: boolean
}

export const SecretInput = ({
  value = '',
  onChange,
  label,
  placeholder = '***masked***',
  disabled = false,
  error,
  isMasked = false,
}: SecretInputProps) => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(value)

  React.useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  const displayValue = isMasked && !isVisible ? '***masked***' : inputValue

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          type={isVisible ? 'text' : 'password'}
          value={displayValue}
          onChange={handleChange}
          disabled={disabled || (isMasked && !isVisible)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          disabled={disabled}
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        >
          {isVisible ? (
            <IconEyeOff className="text-muted-foreground h-4 w-4" />
          ) : (
            <IconEye className="text-muted-foreground h-4 w-4" />
          )}
          <span className="sr-only">{isVisible ? 'Скрыть' : 'Показать'}</span>
        </Button>
      </div>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  )
}
