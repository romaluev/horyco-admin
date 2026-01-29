'use client'

import { useMemo } from 'react'

import {
  IconTrendingUp,
  IconGlobe,
  IconBuildingStore,
} from '@tabler/icons-react'
import {
  Bar,
  Line,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  Tooltip,
} from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

interface IDailyComparisonWidgetProps {
  totalValue?: number
  changePercent?: number
  onlineValue?: number
  onlineChange?: number
  offlineValue?: number
  offlineChange?: number
  isLoading?: boolean
  onViewDetails?: () => void
}

export function DailyComparisonWidget({
  totalValue = 2150000,
  changePercent = 5,
  onlineValue = 20000000,
  onlineChange = 12.6,
  offlineValue = 20000000,
  offlineChange = -4.2,
  isLoading = false,
  onViewDetails,
}: IDailyComparisonWidgetProps) {
  const chartData = useMemo(
    () => [
      { time: '10:00', bar: 3000, line: 3200 },
      { time: '12:00', bar: 4500, line: 4200 },
      { time: '14:00', bar: 3800, line: 3500 },
      { time: '16:00', bar: 2500, line: 2800 },
      { time: '18:00', bar: 4200, line: 4800 },
      { time: '20:00', bar: 5200, line: 5500 },
    ],
    []
  )

  const isPositive = changePercent >= 0

  if (isLoading) {
    return <DailyComparisonWidgetSkeleton />
  }

  return (
    <div className="bg-card flex h-full flex-col rounded-xl border p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
            <IconTrendingUp className="size-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="font-medium">Продажи за день</span>
        </div>
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          Детали
        </Button>
      </div>

      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold">{formatPrice(totalValue)}</span>
        <span
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-sm font-medium',
            isPositive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isPositive ? '+' : ''}
          {changePercent}%
        </span>
      </div>

      <div className="mb-4 flex gap-4 border-y py-3">
        <div className="flex items-center gap-2">
          <IconGlobe className="text-muted-foreground size-4" />
          <span className="text-muted-foreground text-sm">Онлайн</span>
          <span className="font-semibold">
            {formatPrice(onlineValue, { short: true })}
          </span>
          <span
            className={cn(
              'text-xs font-medium',
              onlineChange >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {onlineChange >= 0 ? '+' : ''}
            {onlineChange}%
          </span>
        </div>
        <div className="flex items-center gap-2">
          <IconBuildingStore className="text-muted-foreground size-4" />
          <span className="text-muted-foreground text-sm">Оффлайн</span>
          <span className="font-semibold">
            {formatPrice(offlineValue, { short: true })}
          </span>
          <span
            className={cn(
              'text-xs font-medium',
              offlineChange >= 0 ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {offlineChange >= 0 ? '+' : ''}
            {offlineChange}%
          </span>
        </div>
      </div>

      <div className="min-h-[120px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11 }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                const firstPayload = payload?.[0]
                if (
                  active &&
                  firstPayload?.value !== undefined &&
                  firstPayload.value !== null
                ) {
                  return (
                    <div className="bg-background rounded-lg border px-3 py-2 shadow-lg">
                      <p className="text-muted-foreground mb-1 text-xs">
                        {label}
                      </p>
                      <p className="text-sm font-medium">
                        {formatPrice(Number(firstPayload.value))}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar
              dataKey="bar"
              fill="hsl(var(--chart-success) / 0.3)"
              radius={[2, 2, 2, 2]}
              barSize={20}
            />
            <Line
              type="monotone"
              dataKey="line"
              stroke="hsl(var(--chart-success))"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function DailyComparisonWidgetSkeleton() {
  return (
    <div className="bg-card flex h-full flex-col rounded-xl border p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-muted size-9 animate-pulse rounded-lg" />
          <div className="bg-muted h-5 w-28 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-8 w-16 animate-pulse rounded" />
      </div>
      <div className="mb-4 flex items-baseline gap-3">
        <div className="bg-muted h-9 w-36 animate-pulse rounded" />
        <div className="bg-muted h-6 w-12 animate-pulse rounded-full" />
      </div>
      <div className="mb-4 flex gap-4 border-y py-3">
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
        <div className="bg-muted h-5 w-32 animate-pulse rounded" />
      </div>
      <div className="bg-muted h-[120px] animate-pulse rounded" />
    </div>
  )
}
