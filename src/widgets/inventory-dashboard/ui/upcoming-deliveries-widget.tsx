'use client'

import Link from 'next/link'
import { Truck, Calendar, Clock, AlertCircle } from 'lucide-react'
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'
import { ru } from 'date-fns/locale'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Button } from '@/shared/ui/base/button'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useGetPurchaseOrders, PO_STATUS_LABELS } from '@/entities/purchase-order'

interface IUpcomingDeliveriesWidgetProps {
  warehouseId?: number
  size?: number
}

export function UpcomingDeliveriesWidget({
  warehouseId,
  size = 5,
}: IUpcomingDeliveriesWidgetProps) {
  const { data: sentOrders, isLoading: sentLoading } = useGetPurchaseOrders({
    status: 'sent',
    warehouseId,
  })

  const { data: partialOrders, isLoading: partialLoading } =
    useGetPurchaseOrders({
      status: 'partial',
      warehouseId,
    })

  const isLoading = sentLoading || partialLoading

  const allDeliveries = [
    ...(sentOrders || []),
    ...(partialOrders || []),
  ]
    .filter((po) => po.expectedDate)
    .sort(
      (a, b) =>
        new Date(a.expectedDate!).getTime() -
        new Date(b.expectedDate!).getTime()
    )
    .slice(0, size)

  const totalPending = (sentOrders?.length || 0) + (partialOrders?.length || 0)

  const getDeliveryStatus = (expectedDate: string) => {
    const date = new Date(expectedDate)
    if (isPast(date) && !isToday(date)) {
      return { label: 'Просрочен', variant: 'destructive' as const }
    }
    if (isToday(date)) {
      return { label: 'Сегодня', variant: 'default' as const }
    }
    if (isTomorrow(date)) {
      return { label: 'Завтра', variant: 'secondary' as const }
    }
    return { label: formatDistanceToNow(date, { addSuffix: true, locale: ru }), variant: 'outline' as const }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Ожидаемые поставки
            {totalPending > 0 && (
              <Badge variant="secondary" className="ml-1">
                {totalPending}
              </Badge>
            )}
          </CardTitle>
          <CardDescription>Заказы поставщикам в пути</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/inventory/purchase-orders?status=sent">
            Все заказы
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="max-h-[320px] overflow-auto">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : allDeliveries.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">
            Нет ожидаемых поставок
          </p>
        ) : (
          <div className="space-y-3">
            {allDeliveries.map((po) => {
              const deliveryStatus = getDeliveryStatus(po.expectedDate!)
              const isOverdue =
                isPast(new Date(po.expectedDate!)) &&
                !isToday(new Date(po.expectedDate!))

              return (
                <Link
                  key={po.id}
                  href={`/dashboard/inventory/purchase-orders/${po.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isOverdue && (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="font-medium leading-none">
                        {po.supplierName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {PO_STATUS_LABELS[po.status]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {po.poNumber} • {po.warehouseName}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={deliveryStatus.variant} className="mb-1">
                      {deliveryStatus.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(po.expectedDate!), 'd MMM', {
                        locale: ru,
                      })}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
        {totalPending > size && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/inventory/purchase-orders?status=sent">
                Показать все ({totalPending})
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
