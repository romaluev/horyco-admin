'use client'

import Link from 'next/link'

import { AlertTriangle, Package, TrendingUp, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useStockSummary } from '@/entities/stock'

interface IInventoryStatsCardsProps {
  warehouseId?: number
}

const MILLION = 1000000
const THOUSAND = 1000

function formatCompactValue(value: number): string {
  if (value >= MILLION) {
    return `${(value / MILLION).toFixed(1)}M`
  }
  if (value >= THOUSAND) {
    return `${(value / THOUSAND).toFixed(0)}k`
  }
  return value.toLocaleString('ru-RU')
}

export function InventoryStatsCards({ warehouseId }: IInventoryStatsCardsProps) {
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
              <Skeleton className="mt-1 h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const warehouseParam = warehouseId ? `&warehouseId=${warehouseId}` : ''

  const cards = [
    {
      title: 'Позиций',
      value: summary?.totalItems ?? 0,
      icon: Package,
      description: 'Уникальных товаров',
      href: `/dashboard/inventory/items`,
    },
    {
      title: 'Мало',
      value: summary?.lowStockCount ?? 0,
      icon: AlertTriangle,
      description: 'Требуют пополнения',
      alert: (summary?.lowStockCount ?? 0) > 0,
      alertColor: 'text-amber-500',
      href: `/dashboard/inventory/stock?filter=low${warehouseParam}`,
    },
    {
      title: 'Нет в наличии',
      value: summary?.outOfStockCount ?? 0,
      icon: XCircle,
      description: 'Срочно закупить',
      alert: (summary?.outOfStockCount ?? 0) > 0,
      alertColor: 'text-destructive',
      href: `/dashboard/inventory/stock?filter=out${warehouseParam}`,
    },
    {
      title: 'Стоимость',
      value: formatCompactValue(summary?.totalValue ?? 0),
      icon: TrendingUp,
      description: 'Общая стоимость',
      href: `/dashboard/inventory/stock${warehouseParam ? `?${warehouseParam.slice(1)}` : ''}`,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link key={card.title} href={card.href}>
          <Card
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${card.alert ? 'border-destructive/50' : ''}`}
          >
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
        </Link>
      ))}
    </div>
  )
}
