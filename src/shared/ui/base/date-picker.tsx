'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { Button } from './ui/button'
import { Calendar } from './ui/calendar'

interface DatePickerProps {
  value?: string | Date
  onChange?: (date: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Выберите дату',
  disabled = false,
  className,
  id,
}: DatePickerProps) => {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value))
    }
  }, [value])

  const handleSelect = (selectedDate: Date | undefined): void => {
    setDate(selectedDate)
    if (onChange) {
      onChange(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined)
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'h-9 w-full justify-between text-base font-normal md:text-sm',
            !date && 'text-muted-foreground',
            className
          )}
        >
          {date ? (
            format(date, 'dd.MM.yyyy', { locale: ru })
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          locale={ru}
          className="rounded-md"
          captionLayout="dropdown"
        />
      </PopoverContent>
    </Popover>
  )
}
