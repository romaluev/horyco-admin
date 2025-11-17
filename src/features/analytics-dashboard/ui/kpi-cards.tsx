/**
 * KPI Cards Component
 * Displays 4 key metrics: Revenue, Orders, Avg Check, Top Product
 */

'use client'

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { cn } from '@/shared/lib/utils'
import {
  formatCurrency,
  formatPercentage,
  getTrendDirection,
  getTrendColorClass,
} from '../lib/utils'

import type { IAnalyticsSummary } from '@/entities/analytics'

interface IKpiCardsProps {
  summary: IAnalyticsSummary
  periodLabel: string
}

interface IKpiCardProps {
  title: string
  value: string | number
  change: number | null
  periodLabel: string
  icon?: React.ReactNode
}

const KpiCard = ({
  title,
  value,
  change,
  periodLabel,
  icon,
}: IKpiCardProps) => {
  const direction = getTrendDirection(change)
  const colorClass = getTrendColorClass(change)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== null ? (
          <div className="mt-1 flex items-center gap-1">
            <span className={cn('text-sm font-semibold', colorClass)}>
              {formatPercentage(change)}
            </span>
            {direction === 'up' && (
              <IconTrendingUp className={cn('h-4 w-4', colorClass)} />
            )}
            {direction === 'down' && (
              <IconTrendingDown className={cn('h-4 w-4', colorClass)} />
            )}
            {direction === 'neutral' && <span className="text-sm">→</span>}
          </div>
        ) : (
          <div className="mt-1 text-xs text-muted-foreground">No data</div>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{periodLabel}</p>
      </CardContent>
    </Card>
  )
}

export const KpiCards = ({ summary, periodLabel }: IKpiCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="Revenue"
        value={`${formatCurrency(summary.revenue)} som`}
        change={summary.revenueChangePct}
        periodLabel={periodLabel}
      />

      <KpiCard
        title="Orders"
        value={summary.orders}
        change={summary.ordersChangePct}
        periodLabel={periodLabel}
      />

      <KpiCard
        title="Avg Check"
        value={`${formatCurrency(summary.avgCheck)} som`}
        change={summary.avgCheckChangePct}
        periodLabel={periodLabel}
      />

      {summary.topProduct ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold line-clamp-1">
              {summary.topProduct.name}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {summary.topProduct.orders} orders
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {summary.topProduct.sharePct.toFixed(1)}% of revenue
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No products sold
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {periodLabel}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
