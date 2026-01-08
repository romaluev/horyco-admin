'use client'

import { IconAlertTriangle } from '@tabler/icons-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useGetLowStock } from '@/entities/stock'

interface ILowStockItemsListProps {
  warehouseId?: number
  limit?: number
}

export const LowStockItemsList = ({
  warehouseId,
  limit = 5,
}: ILowStockItemsListProps) => {
  const { data: items, isLoading } = useGetLowStock(warehouseId)

  const displayItems = items?.slice(0, limit) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconAlertTriangle className="h-5 w-5 text-yellow-500" />
          Низкий остаток
        </CardTitle>
        <CardDescription>Товары, требующие пополнения</CardDescription>
      </CardHeader>
      <CardContent>
        {!warehouseId ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Выберите склад
          </p>
        ) : isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : displayItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Все товары в достаточном количестве
          </p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {displayItems.map((item) => (
                <div
                  key={item.inventoryItemId}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {item.inventoryItemName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Мин: {item.minStock} {item.unit}
                    </p>
                  </div>
                  <Badge
                    variant={item.quantity === 0 ? 'destructive' : 'secondary'}
                  >
                    {item.quantity} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
