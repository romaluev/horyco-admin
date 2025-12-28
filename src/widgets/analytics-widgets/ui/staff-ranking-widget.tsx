'use client'

import { cn } from '@/shared/lib/utils'

import type { IRankedItem } from '@/entities/dashboard'

interface StaffRankingWidgetProps {
  data: IRankedItem[]
  isLoading?: boolean
  className?: string
}

export function StaffRankingWidget({
  data,
  isLoading = false,
  className,
}: StaffRankingWidgetProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 rounded-md px-2 py-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
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

  const maxValue = Math.max(...data.map((item) => item.value), 1)

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
            style={{ width: `${(item.value / maxValue) * 100}%` }}
          />

          {/* Content */}
          <div className="relative flex min-w-0 flex-1 items-center gap-2">
            {/* Rank badge */}
            <span
              className={cn(
                'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                item.rank === 1 && 'bg-yellow-500/20 text-yellow-600',
                item.rank === 2 && 'bg-gray-400/20 text-gray-500',
                item.rank === 3 && 'bg-orange-500/20 text-orange-600',
                item.rank > 3 && 'bg-muted text-muted-foreground'
              )}
            >
              {item.rank}
            </span>
            <span className="truncate text-sm font-medium">{item.name}</span>
          </div>

          <div className="relative flex shrink-0 items-center gap-2">
            <div className="text-right">
              <div className="text-sm font-medium tabular-nums">
                {item.formattedValue}
              </div>
              {item.secondaryLabel && (
                <div className="text-xs text-muted-foreground">
                  {item.secondaryValue} {item.secondaryLabel}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
