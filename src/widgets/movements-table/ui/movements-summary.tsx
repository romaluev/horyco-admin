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
    <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-muted/50 px-4 py-3 text-sm">
      <div>
        <span className="text-muted-foreground">Закупки:</span>{' '}
        <span className="font-medium text-emerald-600">+{formatCurrency(totalPurchases)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Продажи:</span>{' '}
        <span className="font-medium text-destructive">-{formatCurrency(totalSales)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Списания:</span>{' '}
        <span className="font-medium text-destructive">-{formatCurrency(totalWriteoffs)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Корректировки:</span>{' '}
        <span className="font-medium text-muted-foreground">{formatCurrency(totalAdjustments)}</span>
      </div>
    </div>
  )
}
