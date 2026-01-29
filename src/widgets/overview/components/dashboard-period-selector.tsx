'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar as CalendarIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { PeriodType } from '@/shared/api/graphql'
import { Button } from '@/shared/ui/base/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/base/popover'
import { Calendar } from '@/shared/ui/base/ui/calendar'

import type { DateRange } from 'react-day-picker'

interface IDashboardPeriodSelectorProps {
  selectedPeriod: PeriodType
  onPeriodChange: (period: PeriodType) => void
  customRange: { start?: string; end?: string }
  onCustomRangeChange: (start: Date, end: Date) => void
}

export function DashboardPeriodSelector({
  selectedPeriod,
  onPeriodChange,
  customRange,
  onCustomRangeChange,
}: IDashboardPeriodSelectorProps) {
  const { t } = useTranslation('dashboard')

  const PERIOD_OPTIONS: { value: PeriodType; label: string }[] = [
    { value: PeriodType.TODAY, label: t('dashboard.overview.periods.today') },
    {
      value: PeriodType.YESTERDAY,
      label: t('dashboard.overview.periods.yesterday'),
    },
    {
      value: PeriodType.THIS_WEEK,
      label: t('dashboard.overview.periods.week'),
    },
    {
      value: PeriodType.THIS_MONTH,
      label: t('dashboard.overview.periods.month'),
    },
  ]
  const [isCustomPickerOpen, setIsCustomPickerOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    customRange.start && customRange.end
      ? { from: new Date(customRange.start), to: new Date(customRange.end) }
      : undefined
  )

  const handlePeriodClick = (period: PeriodType) => {
    if (period === PeriodType.CUSTOM) {
      setIsCustomPickerOpen(true)
    } else {
      onPeriodChange(period)
    }
  }

  const handleApplyCustomRange = () => {
    if (tempRange?.from && tempRange?.to) {
      onCustomRangeChange(tempRange.from, tempRange.to)
      setIsCustomPickerOpen(false)
    }
  }

  const handleCancelCustomRange = () => {
    setTempRange(undefined)
    setIsCustomPickerOpen(false)
  }

  const isCustomSelected = selectedPeriod === PeriodType.CUSTOM
  const customLabel =
    isCustomSelected && customRange.start && customRange.end
      ? `${format(new Date(customRange.start), 'd MMM', { locale: ru })} - ${format(new Date(customRange.end), 'd MMM', { locale: ru })}`
      : t('dashboard.overview.periods.custom')

  return (
    <div className="flex flex-wrap items-center gap-1">
      {PERIOD_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={selectedPeriod === option.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => handlePeriodClick(option.value)}
        >
          {option.label}
        </Button>
      ))}

      <Popover open={isCustomPickerOpen} onOpenChange={setIsCustomPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={isCustomSelected ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePeriodClick(PeriodType.CUSTOM)}
          >
            <CalendarIcon className="mr-2 size-4" />
            {customLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="space-y-4 p-4">
            <div>
              <h4 className="mb-3 text-sm font-medium">
                {t('dashboard.overview.selectPeriod')}
              </h4>
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
                {t('common.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleApplyCustomRange}
                disabled={!tempRange?.from || !tempRange?.to}
              >
                {t('common.apply')}
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
