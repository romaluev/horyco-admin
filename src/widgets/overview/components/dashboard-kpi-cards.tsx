'use client'

import { IconTrendingDown, IconTrendingUp, IconMinus } from '@tabler/icons-react'

import { KpiType, Trend } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { IKpiMetricValue } from '@/entities/dashboard'

interface IDashboardKpiCardsProps {
  metrics: IKpiMetricValue[]
  kpiTypes: KpiType[]
}

const KPI_LABELS: Record<KpiType, string> = {
  [KpiType.REVENUE]: 'Выручка',
  [KpiType.ORDERS]: 'Заказы',
  [KpiType.AVG_CHECK]: 'Средний чек',
  [KpiType.CUSTOMERS]: 'Клиенты',
  [KpiType.NEW_CUSTOMERS]: 'Новые клиенты',
  [KpiType.RETURNING_CUSTOMERS]: 'Постоянные клиенты',
  [KpiType.TIPS]: 'Чаевые',
  [KpiType.REFUNDS]: 'Возвраты',
  [KpiType.CANCELLATIONS]: 'Отмены',
  [KpiType.MARGIN]: 'Маржа',
  [KpiType.RETENTION_RATE]: 'Удержание',
  [KpiType.STAFF_PRODUCTIVITY]: 'Продуктивность',
}

export function DashboardKpiCards({ metrics, kpiTypes }: IDashboardKpiCardsProps) {
  // Create a map of metrics by type for quick lookup
  const metricsMap = new Map(metrics.map((m) => [m.type, m]))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {kpiTypes.map((type) => {
        const metric = metricsMap.get(type)

        if (!metric) {
          return (
            <KpiCardSkeleton key={type} label={KPI_LABELS[type] ?? type} />
          )
        }

        return (
          <KpiCard
            key={type}
            label={KPI_LABELS[type] ?? type}
            value={metric.formattedValue}
            change={metric.changePercent}
            trend={metric.trend}
            comparisonLabel={metric.comparisonLabel}
          />
        )
      })}
    </div>
  )
}

interface IKpiCardProps {
  label: string
  value: string
  change: number | null | undefined
  trend: Trend | null | undefined
  comparisonLabel: string
}

function KpiCard({ label, value, change, trend, comparisonLabel }: IKpiCardProps) {
  const isPositive = trend === Trend.UP
  const isNegative = trend === Trend.DOWN
  const changeValue = change ?? 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <TrendIcon trend={trend} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value ?? '—'}</div>
        <p className="text-xs text-muted-foreground">
          <span
            className={cn(
              'font-medium',
              isPositive && 'text-green-600 dark:text-green-500',
              isNegative && 'text-red-600 dark:text-red-500'
            )}
          >
            {changeValue > 0 ? '+' : ''}
            {changeValue.toFixed(1)}%
          </span>{' '}
          {comparisonLabel}
        </p>
      </CardContent>
    </Card>
  )
}

function TrendIcon({ trend }: { trend: Trend | null | undefined }) {
  switch (trend) {
    case Trend.UP:
      return <IconTrendingUp className="size-4 text-green-600 dark:text-green-500" />
    case Trend.DOWN:
      return <IconTrendingDown className="size-4 text-red-600 dark:text-red-500" />
    default:
      return <IconMinus className="size-4 text-muted-foreground" />
  }
}

function KpiCardSkeleton({ label }: { label: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
