'use client'

import * as React from 'react'

import { Clock } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { ScrollArea } from './scroll-area'

interface TimePickerProps {
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

// Generate hours (00-23) and minutes (00, 05, 10, ..., 55)
const hours = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, '0')
)
const minutes = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, '0')
)

export function TimePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Выберите время',
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedHour, setSelectedHour] = React.useState<string>(
    value ? (value.split(':')[0] ?? '09') : '09'
  )
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    value ? (value.split(':')[1] ?? '00') : '00'
  )

  React.useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':')
      if (hour) setSelectedHour(hour)
      // Round to nearest 5 minutes
      if (minute) {
        const roundedMinute = Math.round(parseInt(minute) / 5) * 5
        setSelectedMinute(roundedMinute.toString().padStart(2, '0'))
      }
    }
  }, [value])

  const handleSelect = (hour: string, minute: string) => {
    setSelectedHour(hour)
    setSelectedMinute(minute)
    onChange?.(`${hour}:${minute}`)
    setOpen(false)
  }

  const displayValue = value || `${selectedHour}:${selectedMinute}`

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
          disabled={disabled}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? displayValue : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Hours column */}
          <div className="flex flex-col">
            <div className="border-b px-4 py-2 text-sm font-medium">Часы</div>
            <ScrollArea className="h-[240px]">
              <div className="flex flex-col p-2">
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    variant={selectedHour === hour ? 'default' : 'ghost'}
                    className="h-9 justify-center"
                    onClick={() => handleSelect(hour, selectedMinute)}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Minutes column */}
          <div className="flex flex-col border-l">
            <div className="border-b px-4 py-2 text-sm font-medium">Минуты</div>
            <ScrollArea className="h-[240px]">
              <div className="flex flex-col p-2">
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    variant={selectedMinute === minute ? 'default' : 'ghost'}
                    className="h-9 justify-center"
                    onClick={() => handleSelect(selectedHour, minute)}
                  >
                    {minute}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
