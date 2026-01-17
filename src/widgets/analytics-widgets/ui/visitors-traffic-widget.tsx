'use client'

import { useMemo } from 'react'

import {
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from '@tabler/icons-react'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

interface IVisitorsTrafficWidgetProps {
  totalVisitors?: number
  changePercent?: number
  devices?: IDeviceBreakdown[]
  isLoading?: boolean
  onViewDetails?: () => void
}

interface IDeviceBreakdown {
  name: string
  percentage: number
  value: number
  trend: 'up' | 'down'
  color: string
}

const DEFAULT_DEVICES: IDeviceBreakdown[] = [
  { name: 'Desktop', percentage: 17, value: 23.8, trend: 'up', color: 'bg-foreground' },
  { name: 'Tablet', percentage: 65, value: 13.604, trend: 'down', color: 'bg-muted' },
  { name: 'Mobile', percentage: 18, value: 47.146, trend: 'up', color: 'bg-muted-foreground' },
]

export function VisitorsTrafficWidget({
  totalVisitors = 23020,
  changePercent = -6,
  devices = DEFAULT_DEVICES,
  isLoading = false,
  onViewDetails,
}: IVisitorsTrafficWidgetProps) {
  const formattedTotal = useMemo(() => {
    if (totalVisitors >= 1000) {
      return `${(totalVisitors / 1000).toFixed(2)}K`
    }
    return totalVisitors.toString()
  }, [totalVisitors])

  const isPositive = changePercent >= 0

  const maxPercentage = useMemo(() => {
    return Math.max(...devices.map((d) => d.percentage))
  }, [devices])

  if (isLoading) {
    return <VisitorsTrafficWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-muted p-2">
            <IconUsers className="size-4 text-muted-foreground" />
          </div>
          <span className="text-sm font-medium">Total visitors</span>
        </div>
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          Details
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span className="text-4xl font-bold">{formattedTotal}</span>
        <span
          className={cn(
            'rounded-md px-2 py-1 text-sm font-medium',
            isPositive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isPositive ? '+' : ''}{changePercent}%
        </span>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4 border-y py-4">
        {devices.map((device, index) => (
          <div key={index} className="text-center">
            <p className="text-xs text-muted-foreground">{device.name}</p>
            <p className="text-2xl font-bold">{device.percentage}%</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {devices.map((device, index) => {
          const heightPercentage = (device.percentage / maxPercentage) * 100
          return (
            <div key={index} className="flex flex-col items-center">
              <div className="mb-2 flex h-24 w-full items-end justify-center">
                <div
                  className={cn('w-full max-w-12 rounded-lg', device.color)}
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{device.value}</span>
                {device.trend === 'up' ? (
                  <IconTrendingUp className="size-3 text-emerald-600" />
                ) : (
                  <IconTrendingDown className="size-3 text-red-600" />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function VisitorsTrafficWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-16 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-6 flex items-center gap-2">
        <div className="h-10 w-20 animate-pulse rounded bg-muted" />
        <div className="h-7 w-12 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-6 grid grid-cols-3 gap-4 border-y py-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="h-3 w-12 animate-pulse rounded bg-muted" />
            <div className="h-8 w-10 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-2 h-24 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
