'use client'

import { Package, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useStockSummary } from '../model/queries'

interface IStockSummaryCardsProps {
  warehouseId?: number
}

export function StockSummaryCards({ warehouseId }: IStockSummaryCardsProps) {
  const { data: summary, isLoading } = useStockSummary(warehouseId)

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
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
      value: summary?.totalItems ?? 0,
      icon: Package,
      description: 'Уникальных позиций',
    },
    {
      title: 'Общая стоимость',
      value: new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'UZS',
        maximumFractionDigits: 0,
      }).format(summary?.totalValue ?? 0),
      icon: TrendingUp,
      description: 'По средней себестоимости',
    },
    {
      title: 'Мало на складе',
      value: summary?.lowStockCount ?? 0,
      icon: AlertTriangle,
      description: 'Требуют пополнения',
      alert: (summary?.lowStockCount ?? 0) > 0,
    },
    {
      title: 'Нет в наличии',
      value: summary?.outOfStockCount ?? 0,
      icon: XCircle,
      description: 'Срочно закупить',
      alert: (summary?.outOfStockCount ?? 0) > 0,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={card.alert ? 'border-destructive' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${card.alert ? 'text-destructive' : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
