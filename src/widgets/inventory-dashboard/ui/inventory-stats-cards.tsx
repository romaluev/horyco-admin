'use client'

import { Package, AlertTriangle, XCircle, TrendingUp, Warehouse } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useStockSummary } from '@/entities/stock'
import { useGetWarehouses } from '@/entities/warehouse'

interface IInventoryStatsCardsProps {
  warehouseId?: number
}

export function InventoryStatsCards({ warehouseId }: IInventoryStatsCardsProps) {
  const { data: summary, isLoading: summaryLoading } = useStockSummary(warehouseId)
  const { data: warehouses, isLoading: warehousesLoading } = useGetWarehouses()

  const isLoading = summaryLoading || warehousesLoading

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-1 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards = [
    {
      title: 'Склады',
      value: warehouses?.length ?? 0,
      icon: Warehouse,
      description: 'Активных складов',
    },
    {
      title: 'Позиций',
      value: summary?.totalItems ?? 0,
      icon: Package,
      description: 'Уникальных товаров',
    },
    {
      title: 'Стоимость',
      value: new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'UZS',
        maximumFractionDigits: 0,
        notation: 'compact',
      }).format(summary?.totalValue ?? 0),
      icon: TrendingUp,
      description: 'Общая стоимость',
    },
    {
      title: 'Мало',
      value: summary?.lowStockCount ?? 0,
      icon: AlertTriangle,
      description: 'Требуют пополнения',
      alert: (summary?.lowStockCount ?? 0) > 0,
      alertColor: 'text-amber-500',
    },
    {
      title: 'Нет в наличии',
      value: summary?.outOfStockCount ?? 0,
      icon: XCircle,
      description: 'Срочно закупить',
      alert: (summary?.outOfStockCount ?? 0) > 0,
      alertColor: 'text-destructive',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <Card key={card.title} className={card.alert ? 'border-destructive/50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon
              className={`h-4 w-4 ${card.alert ? card.alertColor : 'text-muted-foreground'}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.alert ? card.alertColor : ''}`}>
              {card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
