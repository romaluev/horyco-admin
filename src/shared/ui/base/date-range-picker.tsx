'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'


import { cn } from '@/shared/lib/utils'

import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Calendar } from './ui/calendar'

import type { DateRange } from 'react-day-picker'

interface DateRangePickerProps {
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export const DateRangePicker = ({
  value,
  onChange,
  placeholder = 'Выберите период',
  disabled = false,
  className,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleSelect = (range: DateRange | undefined): void => {
    onChange?.(range)
    if (range?.from && range?.to) {
      setIsOpen(false)
    }
  }

  const formatRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder
    if (!range.to) return format(range.from, 'dd MMM', { locale: ru })
    return `${format(range.from, 'dd MMM', { locale: ru })} - ${format(range.to, 'dd MMM', { locale: ru })}`
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-9 w-[200px] justify-start text-base font-normal md:text-sm',
            !value?.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          locale={ru}
          numberOfMonths={2}
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  )
}
