'use client'

import * as React from 'react'

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { PeriodType, DateRange } from './period-filter'

// Типы данных для метрик
export interface AnalyticsMetrics {
  revenue: number
  ordersCount: number
  averageCheck: number
  topDish: {
    id: string
    name: string
    quantity: number
    revenue: number
  }
  previousPeriod?: {
    revenue: number
    ordersCount: number
    averageCheck: number
  }
}

interface MetricCardProps {
  title: string
  value: number
  previousValue?: number
  formatValue: (value: number) => string
  period: string
}

function MetricCard({
  title,
  value,
  previousValue,
  formatValue,
  period,
}: MetricCardProps) {
  // Расчет процента изменения, если есть предыдущее значение
  const changePercent = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : 0

  // Определение тренда (рост или падение)
  const isIncreasing = changePercent > 0

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        {previousValue !== undefined && (
          <div
            className={`mt-1 flex items-center text-xs ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}
          >
            {isIncreasing ? (
              <IconTrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <IconTrendingDown className="mr-1 h-3 w-3" />
            )}
            <span>
              {isIncreasing ? '+' : ''}
              {Math.abs(changePercent).toFixed(1)}%
              <span className="text-muted-foreground ml-1">за {period}</span>
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface TopDishCardProps {
  dish: {
    id: string
    name: string
    quantity: number
    revenue: number
  }
  period: string
  formatCurrency: (value: number) => string
}

function TopDishCard({ dish, period, formatCurrency }: TopDishCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          Самое популярное блюдо
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="truncate text-xl font-bold" title={dish.name}>
          {dish.name}
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span>{dish.quantity} шт.</span>
          <span>{formatCurrency(dish.revenue)}</span>
        </div>
        <div className="text-muted-foreground mt-1 text-xs">за {period}</div>
      </CardContent>
    </Card>
  )
}

interface AnalyticsMetricsProps {
  metrics: AnalyticsMetrics
  period: PeriodType
  dateRange: DateRange
  isLoading?: boolean
  selectedRange: DateRange
  selectedPeriod: PeriodType
}

export function AnalyticsMetrics({
  metrics,
  isLoading = false,
  selectedRange,
  selectedPeriod,
}: AnalyticsMetricsProps) {
  const formatCurrency = (amount: number) => {
    const formattedNumber = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return `UZS ${formattedNumber}`
  }

  // Определение текстового представления периода
  const getPeriodText = () => {
    if (!selectedRange.from) return ''

    if (selectedRange.to) {
      const formattedStartDate = format(selectedRange.from, 'd MMMM', {
        locale: ru,
      })
      const formattedEndDate = format(selectedRange.to, 'd MMMM yyyy', {
        locale: ru,
      })
      return `за ${formattedStartDate} - ${formattedEndDate}`
    }

    const formattedDate = format(selectedRange.from, 'd MMMM yyyy', {
      locale: ru,
    })

    switch (selectedPeriod) {
      case 'hour':
        return `за ${formattedDate}, по часам`
      case 'day':
        return `за ${formattedDate}, по дням`
      case 'week':
        return `за ${formattedDate}, по неделям`
      default:
        return `за ${formattedDate}`
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="bg-muted h-4 w-24 rounded" />
            </CardHeader>
            <CardContent>
              <div className="bg-muted h-8 w-32 rounded" />
              <div className="bg-muted mt-2 h-4 w-20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Выручка"
        value={metrics.revenue}
        previousValue={metrics.previousPeriod?.revenue}
        formatValue={formatCurrency}
        period={getPeriodText()}
      />

      <MetricCard
        title="Кол-во заказов"
        value={metrics.ordersCount}
        previousValue={metrics.previousPeriod?.ordersCount}
        formatValue={(value) => value.toString()}
        period={getPeriodText()}
      />

      <MetricCard
        title="Средний чек"
        value={metrics.averageCheck}
        previousValue={metrics.previousPeriod?.averageCheck}
        formatValue={formatCurrency}
        period={getPeriodText()}
      />

      <TopDishCard
        dish={metrics.topDish}
        period={getPeriodText()}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
