'use client'

import { useMemo } from 'react'

import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'

import type { IHeatmapData } from '@/entities/dashboard/dashboard'

interface HourlyBreakdownWidgetProps {
  data: IHeatmapData | null
  isLoading?: boolean
  className?: string
}
const HOURS = Array.from({ length: 24 }, (_, i) => i)

function getIntensityClass(value: number, maxValue: number): string {
  if (maxValue === 0) return 'bg-muted'
  const ratio = value / maxValue
  if (ratio === 0) return 'bg-muted'
  if (ratio < 0.2) return 'bg-primary/20'
  if (ratio < 0.4) return 'bg-primary/40'
  if (ratio < 0.6) return 'bg-primary/60'
  if (ratio < 0.8) return 'bg-primary/80'
  return 'bg-primary'
}

export function HourlyBreakdownWidget({
  data,
  isLoading = false,
  className,
}: HourlyBreakdownWidgetProps) {
  const { t } = useTranslation('analytics')
  const DAYS = t('heatmapWidget.dayLabels', { returnObjects: true }) as string[]

  const heatmapGrid = useMemo(() => {
    if (!data?.cells) return null

    const grid: Record<string, number> = {}
    data.cells.forEach((cell) => {
      grid[`${cell.dayOfWeek}-${cell.hour}`] = cell.value
    })
    return grid
  }, [data])

  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    )
  }

  if (!data || !heatmapGrid) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Нет данных
      </div>
    )
  }

  return (
    <div className={cn('flex h-full flex-col gap-1 overflow-auto', className)}>
      {/* Hours header */}
      <div className="flex gap-0.5">
        <div className="w-8 shrink-0" />
        {HOURS.filter((h) => h % 2 === 0).map((hour) => (
          <div
            key={hour}
            className="flex-1 text-center text-[10px] text-muted-foreground"
          >
            {hour.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Heatmap grid */}
      {DAYS.map((day, dayIndex) => (
        <div key={day} className="flex gap-0.5">
          <div className="w-8 shrink-0 text-xs text-muted-foreground flex items-center">
            {day}
          </div>
          <div className="flex flex-1 gap-0.5">
            {HOURS.map((hour) => {
              const value = heatmapGrid[`${dayIndex}-${hour}`] ?? 0
              return (
                <div
                  key={hour}
                  className={cn(
                    'h-4 flex-1 rounded-sm transition-colors',
                    getIntensityClass(value, data.maxValue)
                  )}
                  title={`${day} ${hour}:00 - ${value}`}
                />
              )
            })}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted-foreground">
        <span>Меньше</span>
        <div className="flex gap-0.5">
          <div className="h-3 w-3 rounded-sm bg-muted" />
          <div className="h-3 w-3 rounded-sm bg-primary/20" />
          <div className="h-3 w-3 rounded-sm bg-primary/40" />
          <div className="h-3 w-3 rounded-sm bg-primary/60" />
          <div className="h-3 w-3 rounded-sm bg-primary/80" />
          <div className="h-3 w-3 rounded-sm bg-primary" />
        </div>
        <span>Больше</span>
      </div>
    </div>
  )
}
