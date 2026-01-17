'use client'

import { AlertTriangle } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useLowStock } from '@/entities/stock'

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
          <Link href="/dashboard/inventory/stock?filter=low">Все</Link>
        </Button>
      </CardHeader>
      <CardContent>
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
            {lowStockItems.map((stock) => (
              <div
                key={stock.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{stock.item?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {stock.warehouse?.name} • Мин: {stock.item?.minStockLevel}
                  </p>
                </div>
                <Badge variant="outline" className="text-amber-500">
                  {stock.quantity} {stock.item?.unit}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
