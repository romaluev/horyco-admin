'use client'

import { useMemo } from 'react'

import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { KpiType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/base/chart'

import type { ITimeSeriesData } from '@/entities/dashboard/dashboard'
import type { ChartConfig } from '@/shared/ui/base/chart'

interface IDashboardChartProps {
  data: ITimeSeriesData | null | undefined
  metric: KpiType
}

const METRIC_LABELS: Record<KpiType, string> = {
  [KpiType.REVENUE]: 'kpiLabels.revenue',
  [KpiType.ORDERS]: 'kpiLabels.orders',
  [KpiType.AVG_CHECK]: 'kpiLabels.avgCheck',
  [KpiType.CUSTOMERS]: 'kpiLabels.customers',
  [KpiType.NEW_CUSTOMERS]: 'kpiLabels.newCustomers',
  [KpiType.RETURNING_CUSTOMERS]: 'kpiLabels.returningCustomers',
  [KpiType.TIPS]: 'kpiLabels.tips',
  [KpiType.REFUNDS]: 'kpiLabels.refunds',
  [KpiType.CANCELLATIONS]: 'kpiLabels.cancellations',
  [KpiType.MARGIN]: 'kpiLabels.margin',
  [KpiType.RETENTION_RATE]: 'kpiLabels.retentionRate',
  [KpiType.STAFF_PRODUCTIVITY]: 'kpiLabels.staffProductivity',
}

const chartConfig: ChartConfig = {
  value: {
    label: 'Значение',
    color: 'hsl(var(--primary))',
  },
}

export function DashboardChart({ data, metric }: IDashboardChartProps) {
  const { t } = useTranslation('dashboard')
  const chartData = useMemo(() => {
    if (!data?.points) return []
    return data.points.map((point) => ({
      label: point.label,
      value: point.value,
      isHighlighted: point.isHighlighted,
    }))
  }, [data])

  const changePercent = data?.changePercent ?? 0
  const isPositiveChange = changePercent > 0
  const isNegativeChange = changePercent < 0

  const formatValue = (value: number) => {
    if (
      metric === KpiType.REVENUE ||
      metric === KpiType.AVG_CHECK ||
      metric === KpiType.TIPS ||
      metric === KpiType.REFUNDS ||
      metric === KpiType.MARGIN
    ) {
      return formatPrice(value)
    }
    return value.toLocaleString('ru-RU')
  }

  if (!data || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t(METRIC_LABELS[metric] ?? metric)}</CardTitle>
          <CardDescription>{t('analytics.noDataForDisplay')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[300px] items-center justify-center">
            {t('analytics.dataUnavailable')}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{t(METRIC_LABELS[metric] ?? metric)}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span className="text-foreground text-2xl font-bold">
              {formatValue(data.totalValue)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 text-sm font-medium',
                isPositiveChange && 'text-green-600 dark:text-green-500',
                isNegativeChange && 'text-red-600 dark:text-red-500',
                !isPositiveChange &&
                  !isNegativeChange &&
                  'text-muted-foreground'
              )}
            >
              {isPositiveChange && <IconTrendingUp className="size-4" />}
              {isNegativeChange && <IconTrendingDown className="size-4" />}
              {!isPositiveChange && !isNegativeChange && (
                <IconMinus className="size-4" />
              )}
              {changePercent > 0 ? '+' : ''}
              {changePercent.toFixed(1)}%
            </span>
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart
            data={chartData}
            margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fe4a49" stopOpacity={1} />
                <stop offset="95%" stopColor="#fe4a49" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
              tickFormatter={(value) => {
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                return value.toString()
              }}
            />
            <ChartTooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => label}
                  formatter={(value) => [
                    formatValue(Number(value)),
                    t(METRIC_LABELS[metric]),
                  ]}
                />
              }
            />
            <Area
              dataKey="value"
              type="monotone"
              fill="url(#fillValue)"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
