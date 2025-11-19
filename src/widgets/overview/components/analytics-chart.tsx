'use client'

import * as React from 'react'

import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

const THOUSAND = 1000
const MILLION = 1000000

export type ChartMetricType = 'revenue' | 'orders' | 'average'
export type GroupByType = 'hour' | 'day' | 'week'

export interface ChartDataPoint {
  date: string
  value: number
}

export interface ChartData {
  data: ChartDataPoint[]
  metric: ChartMetricType
  groupBy: GroupByType
}

interface AnalyticsChartProps {
  data: ChartData
  onMetricChange: (metric: 'revenue' | 'orders' | 'average') => void
  isLoading?: boolean
}

export function AnalyticsChart({
  data,
  onMetricChange,
  isLoading = false,
}: AnalyticsChartProps) {
  // Форматирование суммы в узбекские сумы - используем статический формат
  const formatCurrency = (amount: number) => {
    // Форматируем вручную, чтобы избежать различий между сервером и клиентом
    const formattedNumber = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return `UZS ${formattedNumber}`
  }

  // Форматирование данных для графика
  const formatChartData = () => {
    if (!data || !data.data) return []

    // Ограничиваем количество точек для оптимизации пространства
    const optimizedData =
      data.data.length > 15
        ? data.data.filter((_, index) => index % 2 === 0)
        : data.data

    return optimizedData.map((item) => ({
      ...item,
      date: formatDate(item.date, data.groupBy),
      value: item.value,
    }))
  }

  // Форматирование даты в зависимости от группировки
  const formatDate = (dateStr: string, groupBy: GroupByType) => {
    try {
      const date = parseISO(dateStr)

      switch (groupBy) {
        case 'hour':
          return format(date, 'HH:00', { locale: ru })
        case 'day':
          return format(date, 'd MMM', { locale: ru })
        case 'week':
          return `${format(date, 'dd.MM', { locale: ru })}`
        default:
          return dateStr
      }
    } catch (e) {
      return dateStr
    }
  }

  // Форматирование значения в зависимости от метрики
  const formatValue = (
    value: number,
    metric: 'revenue' | 'orders' | 'average'
  ) => {
    switch (metric) {
      case 'revenue':
      case 'average':
        return formatCurrency(value)
      case 'orders':
        return value.toString()
      default:
        return value.toString()
    }
  }

  // Получение заголовка в зависимости от метрики
  const getMetricTitle = (metric: 'revenue' | 'orders' | 'average') => {
    switch (metric) {
      case 'revenue':
        return 'Выручка'
      case 'orders':
        return 'Количество заказов'
      case 'average':
        return 'Средний чек'
      default:
        return 'Метрика'
    }
  }

  // Получение описания в зависимости от метрики и группировки
  const getChartDescription = (
    metric: 'revenue' | 'orders' | 'average',
    groupBy: GroupByType
  ) => {
    let metricText = ''
    let periodText = ''

    switch (metric) {
      case 'revenue':
        metricText = 'выручки'
        break
      case 'orders':
        metricText = 'количества заказов'
        break
      case 'average':
        metricText = 'среднего чека'
        break
    }

    switch (groupBy) {
      case 'hour':
        periodText = 'по часам'
        break
      case 'day':
        periodText = 'по дням'
        break
      case 'week':
        periodText = 'по неделям'
        break
    }

    return `Динамика ${metricText} ${periodText}`
  }

  // Определение цвета графика в зависимости от метрики
  const getChartColor = (metric: 'revenue' | 'orders' | 'average') => {
    switch (metric) {
      case 'revenue':
        return 'var(--primary)'
      case 'orders':
        return '#8b5cf6'
      case 'average':
        return '#ec4899'
      default:
        return 'var(--primary)'
    }
  }

  if (isLoading) {
    return (
      <Card className="col-span-3">
        <div className="bg-muted/5 flex h-[300px] w-full items-center justify-center">
          <div className="w-full max-w-md space-y-4">
            <div className="bg-muted h-4 w-full animate-pulse rounded" />
            <div className="bg-muted h-[200px] w-full animate-pulse rounded" />
            <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
          </div>
        </div>
      </Card>
    )
  }

  // Empty state when no data
  if (!data || !data.data || data.data.length === 0) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>{getMetricTitle(data?.metric || 'revenue')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Нет данных</p>
              <p className="text-muted-foreground text-sm">
                за выбранный период
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>{getMetricTitle(data.metric)}</CardTitle>
              <CardDescription>
                {getChartDescription(data.metric, data.groupBy)}
              </CardDescription>
            </div>
            <Tabs
              defaultValue={data.metric}
              value={data.metric}
              onValueChange={(value) =>
                onMetricChange(value as 'revenue' | 'orders' | 'average')
              }
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="revenue">Выручка</TabsTrigger>
                <TabsTrigger value="orders">Заказы</TabsTrigger>
                <TabsTrigger value="average">Средний чек</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height={250}>
            {data.metric === 'orders' ? (
              <BarChart
                data={formatChartData()}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={getChartColor(data.metric)}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={getChartColor(data.metric)}
                      stopOpacity={0.2}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatDate(value, data.groupBy)}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  domain={[0, 'auto']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length && payload[0]) {
                      return (
                        <div className="bg-background rounded-md border p-2 shadow-sm">
                          <p className="text-sm font-medium">
                            {formatDate(label, data.groupBy)}
                          </p>
                          <p className="text-sm">
                            {formatValue(
                              payload[0].value as number,
                              data.metric
                            )}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="url(#colorOrders)"
                  radius={[4, 4, 0, 0]}
                  barSize={data.groupBy === 'hour' ? 20 : 30}
                />
              </BarChart>
            ) : (
              <AreaChart
                data={formatChartData()}
                margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
              >
                <defs>
                  <linearGradient
                    id={`color${data.metric}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={getChartColor(data.metric)}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={getChartColor(data.metric)}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => formatDate(value, data.groupBy)}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  stroke="var(--muted-foreground)"
                  domain={[0, 'auto']}
                  tickFormatter={(value) => {
                    if (
                      data.metric === 'revenue' ||
                      data.metric === 'average'
                    ) {
                      if (value >= MILLION) {
                        return `${(value / MILLION).toFixed(1)}M`
                      }
                      return `${(value / THOUSAND).toFixed(0)}k`
                    }
                    return value.toString()
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length && payload[0]) {
                      return (
                        <div className="bg-background rounded-md border p-2 shadow-sm">
                          <p className="text-sm font-medium">
                            {formatDate(label, data.groupBy)}
                          </p>
                          <p className="text-sm">
                            {formatValue(
                              payload[0].value as number,
                              data.metric
                            )}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={getChartColor(data.metric)}
                  fillOpacity={1}
                  fill={`url(#color${data.metric})`}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
