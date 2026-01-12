'use client'

import { useMemo } from 'react'

import { IconTrendingDown, IconTrendingUp, IconMinus } from '@tabler/icons-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  RadialBar,
  RadialBarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from 'recharts'

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
import { ToggleGroup, ToggleGroupItem } from '@/shared/ui/base/toggle-group'

import { GroupBy } from '@/shared/api/graphql'

import type { ITimeSeriesData, ChartType, ChartVariant } from '@/entities/dashboard'
import type { ChartConfig } from '@/shared/ui/base/chart'

interface IDashboardMainChartProps {
  data: ITimeSeriesData | null | undefined
  metric: KpiType
  chartType: ChartType
  variant: ChartVariant
  groupBy?: GroupBy | null
  onGroupByChange?: (groupBy: GroupBy) => void
  className?: string
}

const METRIC_LABELS: Record<KpiType, string> = {
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

const GROUPBY_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: GroupBy.HOUR, label: 'Часы' },
  { value: GroupBy.DAY, label: 'Дни' },
  { value: GroupBy.WEEK, label: 'Неделя' },
]

const CURRENCY_METRICS = [
  KpiType.REVENUE,
  KpiType.AVG_CHECK,
  KpiType.TIPS,
  KpiType.REFUNDS,
  KpiType.MARGIN,
]

export function DashboardMainChart({
  data,
  metric,
  chartType,
  variant: _variant,
  groupBy,
  onGroupByChange,
  className,
}: IDashboardMainChartProps) {
  const activeChart = chartType
  const activeGroupBy = groupBy ?? GroupBy.DAY

  const chartData = useMemo(() => {
    if (!data?.points) return []
    return data.points.map((point) => ({
      label: point.label,
      value: point.value,
      isHighlighted: point.isHighlighted,
    }))
  }, [data])

  const chartConfig = useMemo<ChartConfig>(() => ({
    value: {
      label: METRIC_LABELS[metric],
      color: 'hsl(var(--primary))',
    },
    previous: {
      label: 'Предыдущий период',
      color: 'hsl(var(--muted-foreground))',
    },
  }), [metric])

  const changePercent = data?.changePercent ?? 0
  const isPositiveChange = changePercent > 0
  const isNegativeChange = changePercent < 0

  const formatValue = (value: number) => {
    if (CURRENCY_METRICS.includes(metric)) {
      return formatPrice(value)
    }
    return value.toLocaleString('ru-RU')
  }

  const formatAxisValue = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
    return value.toString()
  }

  const handleGroupByChange = (value: string) => {
    if (value) {
      onGroupByChange?.(value as GroupBy)
    }
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{METRIC_LABELS[metric] ?? metric}</CardTitle>
          <CardDescription>Нет данных для отображения</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[350px] items-center justify-center text-muted-foreground">
            Данные недоступны
          </div>
        </CardContent>
      </Card>
    )
  }

  const gradientId = `gradient-${metric}-${activeChart}`
  const primaryColor = '#fe4a49'

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle className="text-xl">{METRIC_LABELS[metric] ?? metric}</CardTitle>
          <CardDescription className="flex items-center gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatValue(data.totalValue)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium',
                isPositiveChange && 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                isNegativeChange && 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                !isPositiveChange && !isNegativeChange && 'bg-muted text-muted-foreground'
              )}
            >
              {isPositiveChange && <IconTrendingUp className="size-4" />}
              {isNegativeChange && <IconTrendingDown className="size-4" />}
              {!isPositiveChange && !isNegativeChange && <IconMinus className="size-4" />}
              {changePercent > 0 ? '+' : ''}
              {changePercent.toFixed(1)}%
            </span>
          </CardDescription>
        </div>

        <ToggleGroup
          type="single"
          value={activeGroupBy}
          onValueChange={handleGroupByChange}
          className="rounded-lg border bg-muted/30 p-1"
        >
          {GROUPBY_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="rounded-md px-3 text-sm data-[state=on]:bg-background data-[state=on]:shadow-sm"
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          {activeChart === 'area' ? (
            <AreaChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={primaryColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={primaryColor} stopOpacity={0.05} />
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
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value) => [formatValue(Number(value)), METRIC_LABELS[metric]]}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke={primaryColor}
                strokeWidth={2}
              />
            </AreaChart>
          ) : activeChart === 'bar' ? (
            <BarChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
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
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value) => [formatValue(Number(value)), METRIC_LABELS[metric]]}
                  />
                }
              />
              <Bar
                dataKey="value"
                fill={primaryColor}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          ) : activeChart === 'line' ? (
            <LineChart data={chartData} margin={{ left: 12, right: 12, top: 12, bottom: 0 }}>
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
              />
              <ChartTooltip
                cursor={{ strokeDasharray: '3 3' }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => label}
                    formatter={(value) => [formatValue(Number(value)), METRIC_LABELS[metric]]}
                  />
                }
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke={primaryColor}
                strokeWidth={2}
                dot={{ fill: primaryColor, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          ) : activeChart === 'radial' ? (
            <RadialBarChart
              data={[{ value: data.totalValue, fill: primaryColor }]}
              startAngle={90}
              endAngle={-270}
              innerRadius="60%"
              outerRadius="100%"
            >
              <PolarAngleAxis
                type="number"
                domain={[0, data.totalValue * 1.2]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
              />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-foreground text-2xl font-bold"
              >
                {formatAxisValue(data.totalValue)}
              </text>
            </RadialBarChart>
          ) : activeChart === 'radar' ? (
            <RadarChart data={chartData.slice(0, 6)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" tick={{ fontSize: 11 }} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [formatValue(Number(value)), METRIC_LABELS[metric]]}
                  />
                }
              />
              <Radar
                dataKey="value"
                fill={primaryColor}
                fillOpacity={0.3}
                stroke={primaryColor}
                strokeWidth={2}
              />
            </RadarChart>
          ) : (
            <AreaChart data={chartData}>
              <Area dataKey="value" fill={primaryColor} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function DashboardMainChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-3">
            <div className="h-9 w-40 animate-pulse rounded bg-muted" />
            <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        <div className="h-9 w-[140px] animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-6">
        <div className="h-[350px] w-full animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}
