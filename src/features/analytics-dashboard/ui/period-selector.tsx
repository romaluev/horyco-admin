/**
 * Period Selector Component
 * Allows selection between Day, Week, Month, and Custom date range
 */

'use client'

import { useState } from 'react'
import { Button } from '@/shared/ui/base/button'
import { DatePicker } from '@/shared/ui/base/date-picker'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'
import { cn } from '@/shared/lib/utils'
import type { AnalyticsPeriodType } from '@/entities/analytics'

interface IPeriodSelectorProps {
  value: AnalyticsPeriodType
  onChange: (period: AnalyticsPeriodType) => void
  onCustomRangeChange: (startDate: string, endDate: string) => void
  startDate?: string
  endDate?: string
}

export const PeriodSelector = ({
  value,
  onChange,
  onCustomRangeChange,
  startDate,
  endDate,
}: IPeriodSelectorProps) => {
  const [customStart, setCustomStart] = useState<string | undefined>(startDate)
  const [customEnd, setCustomEnd] = useState<string | undefined>(endDate)
  const [isCustomOpen, setIsCustomOpen] = useState(false)

  const periods: { value: AnalyticsPeriodType; label: string }[] = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'custom', label: 'Custom' },
  ]

  const handleApplyCustomRange = () => {
    if (customStart && customEnd) {
      onCustomRangeChange(customStart, customEnd)
      setIsCustomOpen(false)
    }
  }

  const formatDateRange = () => {
    if (!startDate || !endDate) return 'Select dates'
    return `${startDate} — ${endDate}`
  }

  return (
    <div className="flex items-center gap-2">
      {periods.map((period) => {
        if (period.value === 'custom') {
          return (
            <Popover
              key={period.value}
              open={isCustomOpen}
              onOpenChange={setIsCustomOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant={value === 'custom' ? 'default' : 'outline'}
                  size="sm"
                  className={cn(
                    value === 'custom' && 'bg-primary text-primary-foreground'
                  )}
                >
                  {value === 'custom' ? formatDateRange() : 'Custom'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <DatePicker
                      value={customStart}
                      onChange={setCustomStart}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <DatePicker value={customEnd} onChange={setCustomEnd} />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleApplyCustomRange}
                      disabled={!customStart || !customEnd}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )
        }

        return (
          <Button
            key={period.value}
            variant={value === period.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(period.value)}
          >
            {period.label}
          </Button>
        )
      })}
    </div>
  )
}
