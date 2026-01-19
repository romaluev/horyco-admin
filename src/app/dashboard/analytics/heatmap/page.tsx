/**
 * Heatmap Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 5: Heatmap Analytics
 *
 * PRO tier - Requires analytics_pro or analytics_full entitlement
 * Shows orders/revenue by hour and day of week
 */

'use client'

import * as React from 'react'

import { PeriodType } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/base/skeleton'

import {
  useHeatmap,
  AnalyticsPageLayout,
  AnalyticsErrorState,
  HEATMAP_LEVEL_CONFIG,
} from '@/features/dashboard/analytics'

// ============================================
// CONSTANTS
// ============================================

const DAYS_OF_WEEK = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8) // 8:00 - 22:00

// ============================================
// MAIN COMPONENT
// ============================================

export default function HeatmapPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_MONTH)

  const { data, isLoading, error, refetch } = useHeatmap({
    period: { type: period },
    metric: 'orders',
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export heatmap')
  }

  // Build heatmap grid
  const grid = React.useMemo(() => {
    const cells = data?.cells ?? []
    if (cells.length === 0) return null

    const gridMap: Record<string, number> = {}
    cells.forEach((cell) => {
      gridMap[`${cell.dayOfWeek}-${cell.hour}`] = cell.value ?? 0
    })

    return gridMap
  }, [data])

  return (
    <AnalyticsPageLayout
      pageCode="heatmap"
      title="Тепловая карта"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Content */}
      {isLoading ? (
        <HeatmapSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data && grid ? (
        <div className="space-y-6">
          {/* Heatmap Grid */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Заказов по дням и часам</h3>
            <HeatmapGrid grid={grid} />
          </div>

          {/* Legend */}
          <HeatmapLegend />

          {/* Peak Info */}
          <PeakInfo peakHour={data.peakHour ?? 12} peakDay={data.peakDay ?? 0} />
        </div>
      ) : null}
    </AnalyticsPageLayout>
  )
}

// ============================================
// HEATMAP GRID
// ============================================

interface IHeatmapGridProps {
  grid: Record<string, number>
}

function HeatmapGrid({ grid }: IHeatmapGridProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-12 p-2 text-left text-muted-foreground">Час</th>
            {DAYS_OF_WEEK.map((day, i) => (
              <th key={i} className="min-w-[48px] p-2 text-center text-muted-foreground">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map((hour) => (
            <tr key={hour}>
              <td className="p-2 text-muted-foreground">{hour}:00</td>
              {DAYS_OF_WEEK.map((_, dayIndex) => {
                const value = grid[`${dayIndex}-${hour}`] || 0
                const level = getHeatLevel(value)

                return (
                  <td key={dayIndex} className="p-1">
                    <div
                      className={cn(
                        'flex size-10 items-center justify-center rounded text-xs font-medium',
                        HEATMAP_LEVEL_CONFIG[level].color
                      )}
                      title={`${DAYS_OF_WEEK[dayIndex]} ${hour}:00 - ${value} заказов`}
                    >
                      {value}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function getHeatLevel(value: number): 'low' | 'medium' | 'high' | 'peak' {
  if (value >= HEATMAP_LEVEL_CONFIG.peak.min) return 'peak'
  if (value >= HEATMAP_LEVEL_CONFIG.high.min) return 'high'
  if (value >= HEATMAP_LEVEL_CONFIG.medium.min) return 'medium'
  return 'low'
}

// ============================================
// LEGEND
// ============================================

function HeatmapLegend() {
  const levels = [
    { key: 'low', label: 'Низкий (0-5)' },
    { key: 'medium', label: 'Средний (6-15)' },
    { key: 'high', label: 'Высокий (16-30)' },
    { key: 'peak', label: 'Пик (31+)' },
  ] as const

  return (
    <div className="flex flex-wrap items-center gap-4">
      <span className="text-sm text-muted-foreground">Легенда:</span>
      {levels.map(({ key, label }) => (
        <div key={key} className="flex items-center gap-2">
          <div className={cn('size-4 rounded', HEATMAP_LEVEL_CONFIG[key].color)} />
          <span className="text-sm">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ============================================
// PEAK INFO
// ============================================

interface IPeakInfoProps {
  peakHour: number
  peakDay: number
}

function PeakInfo({ peakHour, peakDay }: IPeakInfoProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-3 text-sm font-medium">Пиковое время</h3>
      <div className="flex gap-6">
        <div>
          <span className="text-sm text-muted-foreground">День:</span>
          <span className="ml-2 font-medium">{DAYS_OF_WEEK[peakDay]}</span>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Час:</span>
          <span className="ml-2 font-medium">{peakHour}:00</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SKELETON
// ============================================

function HeatmapSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="mb-3 h-5 w-48" />
        <div className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 8 * 15 }).map((_, i) => (
              <Skeleton key={i} className="size-10 rounded" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-24" />
        ))}
      </div>
    </div>
  )
}
