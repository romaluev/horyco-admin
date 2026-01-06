'use client'

import {
  IconPackage,
  IconAlertTriangle,
  IconPackageOff,
  IconReceipt,
} from '@tabler/icons-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useGetStockSummary } from '@/entities/stock'

interface StockSummaryCardsProps {
  warehouseId?: number
}

export const StockSummaryCards = ({
  warehouseId,
}: StockSummaryCardsProps) => {
  const { data: summary, isLoading } = useGetStockSummary(warehouseId)

  if (!warehouseId || isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const stats = [
    {
      title: 'Всего позиций',
      value: summary?.totalItems || 0,
      description: 'Товаров на складе',
      icon: IconPackage,
      iconColor: 'text-blue-500',
    },
    {
      title: 'Низкий остаток',
      value: summary?.lowStockCount || 0,
      description: 'Требуют пополнения',
      icon: IconAlertTriangle,
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Нет в наличии',
      value: summary?.outOfStockCount || 0,
      description: 'Закончились',
      icon: IconPackageOff,
      iconColor: 'text-red-500',
    },
    {
      title: 'Стоимость запасов',
      value: `${(summary?.totalValue || 0).toLocaleString()} сум`,
      description: 'Общая стоимость',
      icon: IconReceipt,
      iconColor: 'text-green-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
