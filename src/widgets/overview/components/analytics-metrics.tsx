'use client'

import * as React from 'react'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

import { cn } from '@/shared/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { ChartMetricType } from './analytics-chart'
import type { PeriodFilterDateRange, PeriodType } from './period-filter'

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
  isSelected?: boolean
  onSelect?: () => void
}

function MetricCard({
  title,
  value,
  previousValue,
  formatValue,
  period,
  isSelected = false,
  onSelect,
}: MetricCardProps) {
  // Расчет процента изменения, если есть предыдущее значение
  const changePercent = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : 0

  // Определение тренда (рост или падение)
  const isIncreasing = changePercent > 0

  const isInteractive = Boolean(onSelect)

  return (
    <Card
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      aria-pressed={isInteractive ? isSelected : undefined}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (!isInteractive) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect?.()
        }
      }}
      className={cn(
        isInteractive &&
          'hover:bg-muted/40 focus-visible:ring-ring/50 cursor-pointer transition-colors outline-none focus-visible:ring-[3px]',
        isSelected && 'border-primary ring-primary/15 ring-2'
      )}
    >
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
  const { t } = useTranslation('dashboard')

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {t('analytics.topDish')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="truncate text-xl font-bold" title={dish.name}>
          {dish.name}
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span>
            {dish.quantity} {t('analytics.quantity')}
          </span>
          <span>{formatCurrency(dish.revenue)}</span>
        </div>
        <div className="text-muted-foreground mt-1 text-xs">
          {t('analytics.forPeriod', { period })}
        </div>
      </CardContent>
    </Card>
  )
}

interface AnalyticsMetricsProps {
  metrics: AnalyticsMetrics
  period: PeriodType
  dateRange: PeriodFilterDateRange
  isLoading?: boolean
  selectedRange: PeriodFilterDateRange
  selectedPeriod: PeriodType
  selectedMetric: ChartMetricType
  onMetricChange: (metric: ChartMetricType) => void
}

export function AnalyticsMetrics({
  metrics,
  isLoading = false,
  selectedRange,
  selectedPeriod,
  selectedMetric,
  onMetricChange,
}: AnalyticsMetricsProps) {
  const { t } = useTranslation('dashboard')

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

    switch (selectedPeriod) {
      case 'day':
        return 'по сравнению со вчера'
      case 'week':
        return 'по сравнению с прошлой неделей'
      case 'month':
        return 'по сравнению с прошлым месяцем'
      default:
        return 'за выбранный период'
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
        title={t('analytics.revenue')}
        value={metrics.revenue}
        previousValue={metrics.previousPeriod?.revenue}
        formatValue={formatCurrency}
        period={getPeriodText()}
        isSelected={selectedMetric === 'revenue'}
        onSelect={() => onMetricChange('revenue')}
      />

      <MetricCard
        title={t('analytics.orders_count')}
        value={metrics.ordersCount}
        previousValue={metrics.previousPeriod?.ordersCount}
        formatValue={(value) => value.toString()}
        period={getPeriodText()}
        isSelected={selectedMetric === 'orders'}
        onSelect={() => onMetricChange('orders')}
      />

      <MetricCard
        title={t('analytics.avg_check')}
        value={metrics.averageCheck}
        previousValue={metrics.previousPeriod?.averageCheck}
        formatValue={formatCurrency}
        period={getPeriodText()}
        isSelected={selectedMetric === 'average'}
        onSelect={() => onMetricChange('average')}
      />

      <TopDishCard
        dish={metrics.topDish}
        period={getPeriodText()}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
