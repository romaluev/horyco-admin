'use client'

import { useState } from 'react'

import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import { useBranchStatistics } from '@/entities/organization/branch'

import { CapacityOverview } from './capacity-overview'
import { OrdersMetrics } from './orders-metrics'
import { RevenueChart } from './revenue-chart'
import { TopProductsList } from './top-products-list'

interface BranchStatisticsWidgetProps {
  branchId: number
}

type Period = 'today' | 'week' | 'month' | 'year'

export const BranchStatisticsWidget = ({
  branchId,
}: BranchStatisticsWidgetProps) => {
  const [period, setPeriod] = useState<Period>('week')

  const {
    data: statistics,
    isLoading,
    error,
  } = useBranchStatistics(branchId, period)

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Ошибка загрузки статистики: {error instanceof Error ? error.message : 'Попробуйте позже'}
        </AlertDescription>
      </Alert>
    )
  }

  if (!statistics) return null

  return (
    <div className="space-y-6">
      <Tabs value={period} onValueChange={(value) => setPeriod(value as Period)}>
        <TabsList>
          <TabsTrigger value="today">Сегодня</TabsTrigger>
          <TabsTrigger value="week">Неделя</TabsTrigger>
          <TabsTrigger value="month">Месяц</TabsTrigger>
          <TabsTrigger value="year">Год</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RevenueChart revenue={statistics.revenue} />
        <OrdersMetrics orders={statistics.orders} />
        <CapacityOverview capacity={statistics.capacity} />
      </div>

      <TopProductsList products={statistics.topProducts} />
    </div>
  )
}
