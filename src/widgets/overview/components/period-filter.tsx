'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/shared/ui/base/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'
import { Calendar } from '@/shared/ui/base/ui/calendar'

import type { DateRange } from 'react-day-picker'

export type PeriodType = 'day' | 'week' | 'month' | 'custom'

export interface PeriodFilterDateRange {
  from: Date | undefined
  to: Date | undefined
}

interface PeriodFilterProps {
  selectedPeriod: PeriodType
  onPeriodChange: (period: PeriodType) => void
  selectedRange: PeriodFilterDateRange
  onDateRangeChange: (range: PeriodFilterDateRange) => void
}

export function PeriodFilter({
  selectedPeriod,
  onPeriodChange,
  selectedRange,
  onDateRangeChange,
}: PeriodFilterProps) {
  const [isCustomPickerOpen, setIsCustomPickerOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    selectedRange.from && selectedRange.to
      ? { from: selectedRange.from, to: selectedRange.to }
      : undefined
  )

  const handlePeriodClick = (period: PeriodType) => {
    if (period === 'custom') {
      setIsCustomPickerOpen(true)
    } else {
      onPeriodChange(period)
    }
  }

  const handleApplyCustomRange = () => {
    if (tempRange?.from && tempRange?.to) {
      onDateRangeChange({ from: tempRange.from, to: tempRange.to })
      onPeriodChange('custom')
      setIsCustomPickerOpen(false)
    }
  }

  const handleCancelCustomRange = () => {
    setTempRange(undefined)
    setIsCustomPickerOpen(false)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex gap-1">
        <Button
          variant={selectedPeriod === 'day' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodClick('day')}
        >
          День
        </Button>
        <Button
          variant={selectedPeriod === 'week' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodClick('week')}
        >
          Неделя
        </Button>
        <Button
          variant={selectedPeriod === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodClick('month')}
        >
          Месяц
        </Button>

        <Popover open={isCustomPickerOpen} onOpenChange={setIsCustomPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={selectedPeriod === 'custom' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePeriodClick('custom')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedPeriod === 'custom' &&
              selectedRange.from &&
              selectedRange.to
                ? `${format(selectedRange.from, 'd MMM', { locale: ru })} - ${format(selectedRange.to, 'd MMM', { locale: ru })}`
                : 'Произвольно'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="space-y-4 p-4">
              <div>
                <h4 className="mb-3 text-sm font-medium">Выберите период</h4>
                <Calendar
                  mode="range"
                  defaultMonth={tempRange?.from}
                  selected={tempRange}
                  onSelect={setTempRange}
                  numberOfMonths={2}
                  locale={ru}
                  weekStartsOn={1}
                  disabled={(date) => date > new Date()}
                />
              </div>
              <div className="flex justify-end gap-2 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelCustomRange}
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyCustomRange}
                  disabled={!tempRange?.from || !tempRange?.to}
                >
                  Применить
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
