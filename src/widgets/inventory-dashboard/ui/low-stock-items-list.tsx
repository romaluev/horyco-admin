'use client'

import { AlertTriangle } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Progress } from '@/shared/ui/base/progress'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useLowStock } from '@/entities/inventory/stock'

interface ILowStockItemsListProps {
  warehouseId?: number
  size?: number
}

export function LowStockItemsList({ warehouseId, size = 5 }: ILowStockItemsListProps) {
  const { data: lowStockItems, isLoading } = useLowStock({
    warehouseId,
    size,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Мало на складе
          </CardTitle>
          <CardDescription>Товары требующие пополнения</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link to={"/dashboard/inventory/stock?filter=low" as any}>Все</Link>
        </Button>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto">
        {!warehouseId ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Выберите склад для просмотра
          </p>
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : !lowStockItems?.length ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Нет товаров с низким остатком
          </p>
        ) : (
          <div className="space-y-3">
            {lowStockItems.map((stock) => {
              const minLevel = stock.item?.minStockLevel ?? 1
              const percent = Math.min(100, Math.round((stock.quantity / minLevel) * 100))
              const isOutOfStock = stock.quantity <= 0

              return (
                <div
                  key={stock.id}
                  className="rounded-lg border p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium leading-none">{stock.item?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {stock.warehouse?.name}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={isOutOfStock ? 'text-destructive' : 'text-amber-500'}
                    >
                      {stock.quantity} / {minLevel} {stock.item?.unit}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={percent}
                      className={`h-2 ${isOutOfStock ? '[&>div]:bg-destructive' : '[&>div]:bg-amber-500'}`}
                    />
                    <span className={`text-xs font-medium ${isOutOfStock ? 'text-destructive' : 'text-amber-500'}`}>
                      {percent}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
