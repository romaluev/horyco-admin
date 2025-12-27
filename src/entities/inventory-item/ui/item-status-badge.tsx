'use client'

import { Badge } from '@/shared/ui/base/badge'
import { cn } from '@/shared/lib/utils'

interface ItemStatusBadgeProps {
  quantity: number
  minLevel: number
  className?: string
}

export function ItemStatusBadge({
  quantity,
  minLevel,
  className,
}: ItemStatusBadgeProps) {
  if (quantity <= 0) {
    return (
      <Badge variant="destructive" className={cn('gap-1', className)}>
        <span className="h-2 w-2 rounded-full bg-white" />
        Нет в наличии
      </Badge>
    )
  }

  if (quantity <= minLevel) {
    return (
      <Badge
        variant="outline"
        className={cn('gap-1 border-yellow-500 text-yellow-600', className)}
      >
        <span className="h-2 w-2 rounded-full bg-yellow-500" />
        Мало
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={cn('gap-1 border-green-500 text-green-600', className)}
    >
      <span className="h-2 w-2 rounded-full bg-green-500" />
      В наличии
    </Badge>
  )
}

interface StockLevelIndicatorProps {
  quantity: number
  minLevel: number
  maxLevel?: number
  className?: string
}

export function StockLevelIndicator({
  quantity,
  minLevel,
  maxLevel,
  className,
}: StockLevelIndicatorProps) {
  const max = maxLevel || minLevel * 5
  const percentage = Math.min((quantity / max) * 100, 100)

  let colorClass = 'bg-green-500'
  if (quantity <= 0) {
    colorClass = 'bg-red-500'
  } else if (quantity <= minLevel) {
    colorClass = 'bg-yellow-500'
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full transition-all', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="min-w-[3rem] text-right text-sm text-muted-foreground">
        {quantity.toFixed(1)}
      </span>
    </div>
  )
}
