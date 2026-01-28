'use client'

import { cn } from '@/shared/lib/utils'

import type { IRankedItem } from '@/entities/dashboard/dashboard'

interface TopProductsWidgetProps {
  data: IRankedItem[]
  isLoading?: boolean
  className?: string
}

export function TopProductsWidget({
  data,
  isLoading = false,
  className,
}: TopProductsWidgetProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Нет данных
      </div>
    )
  }

  const maxPercentage = Math.max(...data.map((item) => item.percentage), 1)

  return (
    <div className={cn('space-y-1', className)}>
      {data.map((item) => (
        <div
          key={item.id}
          className="group relative flex items-center justify-between gap-2 rounded-md px-2 py-2 hover:bg-muted/50"
        >
          {/* Background progress bar */}
          <div
            className="absolute inset-y-0 left-0 rounded-md bg-primary/10"
            style={{ width: `${(item.percentage / maxPercentage) * 100}%` }}
          />

          {/* Content */}
          <div className="relative flex min-w-0 flex-1 items-center gap-2">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              {item.rank}
            </span>
            <span className="truncate text-sm font-medium">{item.name}</span>
          </div>

          <div className="relative flex shrink-0 items-center gap-4">
            <span className="text-sm font-medium tabular-nums">
              {item.formattedValue}
            </span>
            <span className="w-10 text-right text-xs text-muted-foreground">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
