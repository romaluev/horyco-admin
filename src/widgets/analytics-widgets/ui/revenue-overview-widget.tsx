'use client'

import { useMemo } from 'react'

import {
  IconTrendingUp,
  IconTrendingDown,
  IconArrowUpRight,
} from '@tabler/icons-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { useTranslation } from 'react-i18next'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/base/chart'

import type { ITimeSeriesData } from '@/entities/dashboard/dashboard'

interface IRevenueOverviewWidgetProps {
  data: ITimeSeriesData | null
  isLoading?: boolean
  onViewDetails?: () => void
}

export function RevenueOverviewWidget({
  data,
  isLoading = false,
  onViewDetails,
}: IRevenueOverviewWidgetProps) {
  const { t } = useTranslation('dashboard')

  const chartData = useMemo(() => {
    if (!data?.points) return []
    return data.points.map((point) => ({
      label: point.label,
      value: point.value,
    }))
  }, [data])

  const chartConfig = useMemo(() => ({
    value: {
      label: t('kpiLabels.revenue'),
      color: 'hsl(var(--chart-success))',
    },
  }), [t])

  const totalValue = data?.totalValue ?? 0
  const changePercent = data?.changePercent ?? 0
  const isPositive = changePercent >= 0

  const formatAxisValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  if (isLoading) {
    return <RevenueOverviewWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="flex items-start justify-between border-b p-5">
        <div>
          <h3 className="text-lg font-semibold">{t('widgetTitles.revenueOverview')}</h3>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(totalValue)}</span>
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-sm font-medium',
                isPositive
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              {isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
              {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          {t('common.details')}
          <IconArrowUpRight className="ml-1 size-4" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 12, top: 12, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueWidgetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--chart-success))" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(var(--chart-success))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              tickFormatter={formatAxisValue}
              width={50}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  formatter={(value) => [formatPrice(Number(value)), t('kpiLabels.revenue')]}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--chart-success))"
              strokeWidth={2}
              fill="url(#revenueWidgetGradient)"
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}

function RevenueOverviewWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="flex items-start justify-between border-b p-5">
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-40 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex-1 p-4">
        <div className="h-[200px] animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
