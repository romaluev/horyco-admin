'use client'

import { formatPrice } from '@/shared/lib/format'

interface IStockSummaryProps {
  totalItems: number
  lowStockCount: number
  outOfStockCount: number
  totalValue: number
}

export const StockSummary = ({
  totalItems,
  lowStockCount,
  outOfStockCount,
  totalValue,
}: IStockSummaryProps) => {
  return (
    <div className="bg-muted/50 flex flex-wrap items-center gap-6 rounded-lg border px-4 py-3 text-sm">
      <div>
        <span className="text-muted-foreground">Всего позиций:</span>{' '}
        <span className="font-medium">{totalItems}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Мало на складе:</span>{' '}
        <span className="font-medium text-yellow-600">{lowStockCount}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Нет в наличии:</span>{' '}
        <span className="text-destructive font-medium">{outOfStockCount}</span>
      </div>
      <div className="ml-auto">
        <span className="text-muted-foreground">Общая стоимость:</span>{' '}
        <span className="font-medium">{formatPrice(totalValue)}</span>
      </div>
    </div>
  )
}
