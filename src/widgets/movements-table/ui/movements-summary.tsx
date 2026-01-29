'use client'

import { formatCurrency } from '@/shared/lib/format'

interface IMovementsSummaryProps {
  totalPurchases: number
  totalSales: number
  totalWriteoffs: number
  totalAdjustments: number
}

export const MovementsSummary = ({
  totalPurchases,
  totalSales,
  totalWriteoffs,
  totalAdjustments,
}: IMovementsSummaryProps) => {
  return (
    <div className="bg-muted/50 flex flex-wrap items-center gap-6 rounded-lg border px-4 py-3 text-sm">
      <div>
        <span className="text-muted-foreground">Закупки:</span>{' '}
        <span className="font-medium text-emerald-600">
          +{formatCurrency(totalPurchases)}
        </span>
      </div>
      <div>
        <span className="text-muted-foreground">Продажи:</span>{' '}
        <span className="text-destructive font-medium">
          -{formatCurrency(totalSales)}
        </span>
      </div>
      <div>
        <span className="text-muted-foreground">Списания:</span>{' '}
        <span className="text-destructive font-medium">
          -{formatCurrency(totalWriteoffs)}
        </span>
      </div>
      <div>
        <span className="text-muted-foreground">Корректировки:</span>{' '}
        <span className="text-muted-foreground font-medium">
          {formatCurrency(totalAdjustments)}
        </span>
      </div>
    </div>
  )
}
