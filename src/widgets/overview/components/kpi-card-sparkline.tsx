'use client'

import { useMemo } from 'react'

import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus,
  IconCurrencyDollar,
  IconShoppingCart,
  IconReceipt,
  IconUsers,
  IconUserPlus,
  IconRefresh,
  IconCash,
  IconReceiptRefund,
  IconX,
  IconChartBar,
  IconPercentage,
  IconActivity,
} from '@tabler/icons-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { KpiType, Trend } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Card, CardContent } from '@/shared/ui/base/card'

import type { IKpiMetricValue } from '@/entities/dashboard'

// Hardcoded colors for proper rendering (CSS variables use oklch, not hsl)
const CHART_SUCCESS = '#22c55e'
const CHART_DANGER = '#ef4444'
const CHART_NEUTRAL = '#9ca3af'

interface IKpiCardSparklineProps {
  metric: IKpiMetricValue
  sparklineData?: number[]
  className?: string
}

const KPI_CONFIG: Record<
  KpiType,
  {
    label: string
    icon: typeof IconCurrencyDollar
    color: string
    bgColor: string
  }
> = {
  [KpiType.REVENUE]: {
    label: 'Выручка',
    icon: IconCurrencyDollar,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  [KpiType.ORDERS]: {
    label: 'Заказы',
    icon: IconShoppingCart,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  [KpiType.AVG_CHECK]: {
    label: 'Средний чек',
    icon: IconReceipt,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  [KpiType.CUSTOMERS]: {
    label: 'Клиенты',
    icon: IconUsers,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  [KpiType.NEW_CUSTOMERS]: {
    label: 'Новые клиенты',
    icon: IconUserPlus,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
  [KpiType.RETURNING_CUSTOMERS]: {
    label: 'Постоянные',
    icon: IconRefresh,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  [KpiType.TIPS]: {
    label: 'Чаевые',
    icon: IconCash,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  [KpiType.REFUNDS]: {
    label: 'Возвраты',
    icon: IconReceiptRefund,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  [KpiType.CANCELLATIONS]: {
    label: 'Отмены',
    icon: IconX,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  [KpiType.MARGIN]: {
    label: 'Маржа',
    icon: IconChartBar,
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-100 dark:bg-lime-900/30',
  },
  [KpiType.RETENTION_RATE]: {
    label: 'Удержание',
    icon: IconPercentage,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  [KpiType.STAFF_PRODUCTIVITY]: {
    label: 'Продуктивность',
    icon: IconActivity,
    color: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
  },
}

function generateSparklineData(baseValue: number, trend: Trend): number[] {
  const points = 12
  const data: number[] = []
  let value = baseValue * 0.7

  for (let i = 0; i < points; i++) {
    const trendFactor = trend === Trend.UP ? 1.05 : trend === Trend.DOWN ? 0.95 : 1
    const randomFactor = 0.9 + Math.random() * 0.2
    value = value * trendFactor * randomFactor
    data.push(Math.round(value))
  }

  return data
}

export function KpiCardSparkline({
  metric,
  sparklineData,
  className,
}: IKpiCardSparklineProps) {
  const config = KPI_CONFIG[metric.type]
  const Icon = config.icon

  const isPositive = metric.trend === Trend.UP
  const isNegative = metric.trend === Trend.DOWN
  const changeValue = metric.changePercent ?? 0

  const chartData = useMemo(() => {
    const rawData = sparklineData ?? generateSparklineData(metric.value, metric.trend)
    return rawData.map((value, index) => ({ value, index }))
  }, [sparklineData, metric.value, metric.trend])

  const strokeColor = isPositive
    ? CHART_SUCCESS
    : isNegative
      ? CHART_DANGER
      : CHART_NEUTRAL

  return (
    <Card className={cn('overflow-hidden transition-all hover:shadow-md', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className={cn('rounded-lg p-2', config.bgColor)}>
                <Icon className={cn('size-4', config.color)} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {config.label}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-bold tracking-tight">
                {metric.formattedValue}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                    isPositive && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                    isNegative && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                    !isPositive && !isNegative && 'bg-muted text-muted-foreground'
                  )}
                >
                  {isPositive && <IconTrendingUp className="size-3" />}
                  {isNegative && <IconTrendingDown className="size-3" />}
                  {!isPositive && !isNegative && <IconMinus className="size-3" />}
                  <span>
                    {changeValue > 0 ? '+' : ''}
                    {changeValue.toFixed(1)}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {metric.comparisonLabel}
                </span>
              </div>
            </div>
          </div>

          <div className="h-16 w-24 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${metric.type}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={strokeColor}
                  strokeWidth={2}
                  fill={`url(#gradient-${metric.type})`}
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function KpiCardSparklineSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            </div>
            <div className="space-y-1">
              <div className="h-8 w-28 animate-pulse rounded bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
          <div className="h-16 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
