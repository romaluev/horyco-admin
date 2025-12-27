'use client'

import { IconArrowsExchange } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useGetMovements } from '@/entities/stock-movement'
import { MovementTypeBadge, MovementQuantityBadge } from '@/entities/stock-movement'

interface IRecentMovementsWidgetProps {
  warehouseId?: number
  limit?: number
}

export const RecentMovementsWidget = ({
  warehouseId,
  limit = 5,
}: IRecentMovementsWidgetProps) => {
  const { data, isLoading } = useGetMovements({ warehouseId, limit })

  const movements = data?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconArrowsExchange className="h-5 w-5 text-blue-500" />
          Последние движения
        </CardTitle>
        <CardDescription>История движения товаров</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        ) : movements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет движений товаров
          </p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {movement.inventoryItemName || movement.item?.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <MovementTypeBadge type={movement.movementType} />
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(movement.createdAt), {
                          addSuffix: true,
                          locale: ru,
                        })}
                      </span>
                    </div>
                  </div>
                  <MovementQuantityBadge
                    quantity={movement.quantity}
                    unit={movement.unit || movement.item?.unit || ''}
                  />
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
