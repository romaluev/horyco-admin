'use client'

import Link from 'next/link'

import { IconTruckDelivery } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Button } from '@/shared/ui/base/button'
import { Badge } from '@/shared/ui/base/badge'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useGetUpcomingDeliveries, POStatusBadge } from '@/entities/purchase-order'

interface IUpcomingDeliveriesWidgetProps {
  branchId?: number
  limit?: number
}

export const UpcomingDeliveriesWidget = ({
  branchId,
  limit = 5,
}: IUpcomingDeliveriesWidgetProps) => {
  const { data, isLoading } = useGetUpcomingDeliveries(branchId)
  const deliveries = data?.data?.slice(0, limit) || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconTruckDelivery className="h-5 w-5 text-orange-500" />
          Ожидаемые поставки
        </CardTitle>
        <CardDescription>Заказы в пути</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : deliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет ожидаемых поставок
          </p>
        ) : (
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {deliveries.map((delivery) => (
                <div
                  key={delivery.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {delivery.supplierName || delivery.supplier?.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <POStatusBadge status={delivery.status} />
                      {delivery.expectedDate && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(delivery.expectedDate), 'd MMM', {
                            locale: ru,
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline">
                    {delivery.totalItems || delivery.items?.length || 0} поз.
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/inventory/purchase-orders">
              Все заказы
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
