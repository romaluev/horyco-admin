'use client'

import { Badge } from '@/shared/ui/base/badge'

interface StockLevelIndicatorProps {
  quantity: number
  minStockLevel?: number
}

export const StockLevelIndicator = ({
  quantity,
  minStockLevel,
}: StockLevelIndicatorProps) => {
  if (quantity === 0) {
    return (
      <Badge variant="destructive">Нет в наличии</Badge>
    )
  }

  if (minStockLevel && quantity < minStockLevel) {
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        Низкий остаток
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
      В наличии
    </Badge>
  )
}
