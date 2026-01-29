'use client'

import { useMemo } from 'react'

import {
  IconTrendingDown,
  IconTrendingUp,
  IconMinus,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
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

import { KpiType, GroupBy } from '@/shared/api/graphql'
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

import {
  KPI_LABELS,
  CURRENCY_METRICS,
  PRIMARY_COLOR,
  type ITimeSeriesData,
  type ChartType,
  type ChartVariant,
} from '@/entities/dashboard/dashboard'

import type { ChartConfig } from '@/shared/ui/base/chart'

// Map KPI_LABELS to translation keys
const getKPILabelTranslationKey = (kpiType: KpiType): string => {
  const keyMap: Record<KpiType, string> = {
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
  return keyMap[kpiType] || 'kpiLabels.revenue'
}

interface IDashboardMainChartProps {
  data: ITimeSeriesData | null | undefined
  metric: KpiType
  chartType: ChartType
  variant: ChartVariant
  groupBy?: GroupBy | null
  onGroupByChange?: (groupBy: GroupBy) => void
  className?: string
  isLoading?: boolean
}

const GROUPBY_OPTIONS: { value: GroupBy; label: string }[] = [
  { value: GroupBy.HOUR, label: 'Часы' },
  { value: GroupBy.DAY, label: 'Дни' },
  { value: GroupBy.WEEK, label: 'Неделя' },
]

export function DashboardMainChart({
  data,
  metric,
  chartType,
  variant: _variant,
  groupBy,
  onGroupByChange,
  className,
  isLoading = false,
}: IDashboardMainChartProps) {
  const { t } = useTranslation('dashboard')
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

  const chartConfig = useMemo<ChartConfig>(
    () => ({
      value: {
        label: t(getKPILabelTranslationKey(metric)),
        color: 'hsl(var(--primary))',
      },
      previous: {
        label: 'Предыдущий период',
        color: 'hsl(var(--muted-foreground))',
      },
    }),
    [metric, t]
  )

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

  if (isLoading && !data) {
    return <DashboardMainChartSkeleton className={className} />
  }

  if (!data || chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{t(getKPILabelTranslationKey(metric))}</CardTitle>
          <CardDescription>{t('analytics.noDataForDisplay')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[350px] items-center justify-center">
            {t('analytics.dataUnavailable')}
          </div>
        </CardContent>
      </Card>
    )
  }

  const gradientId = `gradient-${metric}-${activeChart}`

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
        </div>
      )}
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle className="text-xl">
            {t(getKPILabelTranslationKey(metric))}
          </CardTitle>
          <CardDescription className="flex items-center gap-3">
            <span className="text-foreground text-3xl font-bold">
              {formatValue(data.totalValue)}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium',
                isPositiveChange &&
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
                isNegativeChange &&
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                !isPositiveChange &&
                  !isNegativeChange &&
                  'bg-muted text-muted-foreground'
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

        <ToggleGroup
          type="single"
          value={activeGroupBy}
          onValueChange={handleGroupByChange}
          className="bg-muted/30 rounded-lg border p-1"
        >
          {GROUPBY_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              className="data-[state=on]:bg-background rounded-md px-3 text-sm data-[state=on]:shadow-sm"
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
            <AreaChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={PRIMARY_COLOR}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor={PRIMARY_COLOR}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
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
                    formatter={(value) => [
                      formatValue(Number(value)),
                      t(getKPILabelTranslationKey(metric)),
                    ]}
                  />
                }
              />
              <Area
                dataKey="value"
                type="monotone"
                fill={`url(#${gradientId})`}
                stroke={PRIMARY_COLOR}
                strokeWidth={2}
              />
            </AreaChart>
          ) : activeChart === 'bar' ? (
            <BarChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
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
                    formatter={(value) => [
                      formatValue(Number(value)),
                      t(getKPILabelTranslationKey(metric)),
                    ]}
                  />
                }
              />
              <Bar dataKey="value" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : activeChart === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                className="stroke-muted"
              />
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
                    formatter={(value) => [
                      formatValue(Number(value)),
                      t(getKPILabelTranslationKey(metric)),
                    ]}
                  />
                }
              />
              <Line
                dataKey="value"
                type="monotone"
                stroke={PRIMARY_COLOR}
                strokeWidth={2}
                dot={{ fill: PRIMARY_COLOR, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          ) : activeChart === 'radial' ? (
            <RadialBarChart
              data={[{ value: data.totalValue, fill: PRIMARY_COLOR }]}
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
              <RadialBar background dataKey="value" cornerRadius={10} />
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
                    formatter={(value) => [
                      formatValue(Number(value)),
                      t(getKPILabelTranslationKey(metric)),
                    ]}
                  />
                }
              />
              <Radar
                dataKey="value"
                fill={PRIMARY_COLOR}
                fillOpacity={0.3}
                stroke={PRIMARY_COLOR}
                strokeWidth={2}
              />
            </RadarChart>
          ) : (
            <AreaChart data={chartData}>
              <Area dataKey="value" fill={PRIMARY_COLOR} />
            </AreaChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function DashboardMainChartSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-4 space-y-0 border-b py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <div className="bg-muted h-6 w-32 animate-pulse rounded" />
          <div className="flex items-center gap-3">
            <div className="bg-muted h-9 w-40 animate-pulse rounded" />
            <div className="bg-muted h-6 w-16 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="bg-muted h-9 w-[140px] animate-pulse rounded" />
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-6">
        <div className="bg-muted h-[350px] w-full animate-pulse rounded" />
      </CardContent>
    </Card>
  )
}
