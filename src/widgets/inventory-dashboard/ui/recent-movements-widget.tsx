'use client'

import { ArrowLeftRight } from 'lucide-react'
import Link from 'next/link'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Button } from '@/shared/ui/base/button'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useGetMovements, MovementTypeBadge } from '@/entities/inventory/stock-movement'

interface IRecentMovementsWidgetProps {
  warehouseId?: number
  size?: number
}

export function RecentMovementsWidget({
  warehouseId,
  size = 5,
}: IRecentMovementsWidgetProps) {
  const { data, isLoading } = useGetMovements({
    warehouseId,
    size,
  })

  const movements = data?.data ?? []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5" />
            Последние движения
          </CardTitle>
          <CardDescription>История операций с товарами</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/inventory/movements">Все</Link>
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
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        ) : !movements.length ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Нет движений товаров
          </p>
        ) : (
          <div className="space-y-3">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <p className="font-medium leading-none">{movement.item?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {movement.warehouse?.name} •{' '}
                    {movement.quantity > 0 ? '+' : ''}
                    {movement.quantity} {movement.item?.unit}
                  </p>
                </div>
                <MovementTypeBadge type={movement.type} showIcon={false} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
