'use client'

import { AlertTriangle, CheckCircle, XCircle, TrendingUp } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Badge } from '@/shared/ui/base/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/base/tooltip'

interface IStockLevelIndicatorProps {
  quantity: number
  minLevel?: number
  maxLevel?: number
  showLabel?: boolean
  className?: string
}

type StockLevel = 'out' | 'low' | 'ok' | 'over'

function getStockLevel(
  quantity: number,
  minLevel?: number,
  maxLevel?: number
): StockLevel {
  if (quantity <= 0) return 'out'
  if (minLevel && quantity < minLevel) return 'low'
  if (maxLevel && quantity > maxLevel) return 'over'
  return 'ok'
}

const levelConfig: Record<
  StockLevel,
  {
    label: string
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    icon: typeof CheckCircle
    color: string
  }
> = {
  out: {
    label: 'Нет в наличии',
    variant: 'destructive',
    icon: XCircle,
    color: 'text-destructive',
  },
  low: {
    label: 'Мало',
    variant: 'outline',
    icon: AlertTriangle,
    color: 'text-yellow-600',
  },
  ok: {
    label: 'В наличии',
    variant: 'default',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  over: {
    label: 'Избыток',
    variant: 'secondary',
    icon: TrendingUp,
    color: 'text-blue-600',
  },
}

export function StockLevelIndicator({
  quantity,
  minLevel,
  maxLevel,
  showLabel = false,
  className,
}: IStockLevelIndicatorProps) {
  const level = getStockLevel(quantity, minLevel, maxLevel)
  const config = levelConfig[level]
  const Icon = config.icon

  const content = (
    <Badge variant={config.variant} className={cn('gap-1', className)}>
      <Icon className="h-3 w-3" />
      {showLabel && <span>{config.label}</span>}
      {!showLabel && <span>{quantity}</span>}
    </Badge>
  )

  if (showLabel) {
    return content
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent>
          <p>{config.label}</p>
          {minLevel && (
            <p className="text-muted-foreground text-xs">Мин: {minLevel}</p>
          )}
          {maxLevel && (
            <p className="text-muted-foreground text-xs">Макс: {maxLevel}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
