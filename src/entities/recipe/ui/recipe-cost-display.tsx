'use client'

import { TrendingUp, Clock } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'

interface IRecipeCostDisplayProps {
  cost: number
  sellingPrice?: number
  lastUpdated?: string | null
}

export function RecipeCostDisplay({ cost, sellingPrice, lastUpdated }: IRecipeCostDisplayProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const margin = sellingPrice ? ((sellingPrice - cost) / sellingPrice) * 100 : null

  const getMarginVariant = (marginPct: number) => {
    if (marginPct >= 60) return 'default'
    if (marginPct >= 40) return 'outline'
    return 'destructive'
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="font-medium">{formatCurrency(cost)}</span>
      {margin !== null && (
        <Badge variant={getMarginVariant(margin)}>
          <TrendingUp className="mr-1 h-3 w-3" />
          {margin.toFixed(1)}%
        </Badge>
      )}
      {lastUpdated && (
        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(lastUpdated).toLocaleDateString('ru-RU')}
        </span>
      )}
    </div>
  )
}
