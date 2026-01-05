'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Icons } from '@/shared/ui/icons'
import { cn } from '@/shared/lib/utils'

import { useGetStockSummary } from '../model/queries'

interface StockSummaryCardsProps {
  warehouseId?: number
  className?: string
}

export function StockSummaryCards({
  warehouseId,
  className,
}: StockSummaryCardsProps) {
  const { data, isLoading } = useGetStockSummary(warehouseId)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className={cn('grid gap-4 md:grid-cols-4', className)}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Всего товаров',
      value: data?.totalItems ?? 0,
      icon: Icons.package,
      className: '',
    },
    {
      title: 'Мало на складе',
      value: data?.lowStockCount ?? 0,
      icon: Icons.warning,
      className: data?.lowStockCount ? 'text-yellow-600' : '',
      alert: data?.lowStockCount && data.lowStockCount > 0,
    },
    {
      title: 'Нет в наличии',
      value: data?.outOfStockCount ?? 0,
      icon: Icons.close,
      className: data?.outOfStockCount ? 'text-red-600' : '',
      alert: data?.outOfStockCount && data.outOfStockCount > 0,
    },
    {
      title: 'Стоимость запасов',
      value: `${formatCurrency(data?.totalValue ?? 0)} UZS`,
      icon: Icons.billing,
      className: '',
    },
  ]

  return (
    <div className={cn('grid gap-4 md:grid-cols-4', className)}>
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={cn('h-4 w-4 text-muted-foreground', card.className)}
            />
          </CardHeader>
          <CardContent>
            <div className={cn('text-2xl font-bold', card.className)}>
              {card.value}
            </div>
            {card.alert && (
              <p className="text-xs text-muted-foreground">Требуется внимание</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
