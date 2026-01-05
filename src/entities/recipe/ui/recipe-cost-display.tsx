'use client'

import { cn } from '@/shared/lib/utils'

interface RecipeCostDisplayProps {
  cost: number
  sellingPrice?: number
  className?: string
}

export function RecipeCostDisplay({
  cost,
  sellingPrice,
  className,
}: RecipeCostDisplayProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const margin = sellingPrice
    ? ((sellingPrice - cost) / sellingPrice) * 100
    : null

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Себестоимость:</span>
        <span className="font-medium">{formatCurrency(cost)} UZS</span>
      </div>
      {sellingPrice !== undefined && (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Цена продажи:</span>
            <span className="font-medium">{formatCurrency(sellingPrice)} UZS</span>
          </div>
          {margin !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Маржа:</span>
              <span
                className={cn(
                  'font-medium',
                  margin >= 50
                    ? 'text-green-600'
                    : margin >= 30
                      ? 'text-yellow-600'
                      : 'text-red-600'
                )}
              >
                {margin.toFixed(1)}%
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

interface RecipeMarginBadgeProps {
  cost: number
  sellingPrice: number
  className?: string
}

export function RecipeMarginBadge({
  cost,
  sellingPrice,
  className,
}: RecipeMarginBadgeProps) {
  if (!sellingPrice || sellingPrice <= 0) return null

  const margin = ((sellingPrice - cost) / sellingPrice) * 100

  return (
    <span
      className={cn(
        'rounded px-2 py-0.5 text-xs font-medium',
        margin >= 50
          ? 'bg-green-100 text-green-700'
          : margin >= 30
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-red-100 text-red-700',
        className
      )}
    >
      {margin.toFixed(0)}%
    </span>
  )
}
