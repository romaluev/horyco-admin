/**
 * Forecasting Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 10: Forecasting Analytics
 *
 * ULTRA tier - Requires analytics_full entitlement
 * Shows revenue/orders forecast based on cash flow projections
 *
 * NOTE: Per doc 29 - Uses cashFlow data for projections
 * The standalone forecast query is not implemented
 */

'use client'

import * as React from 'react'

import { IconInfoCircle, IconTrendingUp } from '@tabler/icons-react'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { Skeleton } from '@/shared/ui/base/skeleton'

import {
  useCashFlow,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/analytics'

// ============================================
// MAIN COMPONENT
// ============================================

export default function ForecastingPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_MONTH)

  const { data, isLoading, error, refetch } = useCashFlow({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export forecasting')
  }

  return (
    <AnalyticsPageLayout
      pageCode="forecasting"
      title="Прогнозирование"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {/* Content */}
      {isLoading ? (
        <ForecastSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <ForecastContent data={data} />
      ) : null}
    </AnalyticsPageLayout>
  )
}

// ============================================
// FORECAST CONTENT
// ============================================

interface IForecastContentProps {
  data: {
    inflows: Array<{ source: string; amount: number; date: string }>
    outflows: Array<{ category: string; amount: number; date: string }>
    netFlow: number
    openingBalance: number
    closingBalance: number
  }
}

function ForecastContent({ data }: IForecastContentProps) {
  // Calculate projections based on current cash flow trends
  // Add defensive checks for undefined arrays and values
  const inflows = data.inflows ?? []
  const outflows = data.outflows ?? []
  const totalInflow = inflows.reduce((sum, item) => sum + item.amount, 0)
  const totalOutflow = outflows.reduce((sum, item) => sum + item.amount, 0)
  const netFlow = data.netFlow ?? 0
  const openingBalance = data.openingBalance ?? 0
  const closingBalance = data.closingBalance ?? 0

  return (
    <div className="space-y-6">
      {/* Cash Flow Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Прогноз притока"
          value={formatPrice(totalInflow)}
          trend="UP"
        />
        <SummaryCard
          label="Прогноз оттока"
          value={formatPrice(totalOutflow)}
          trend="DOWN"
        />
        <SummaryCard
          label="Чистый денежный поток"
          value={formatPrice(netFlow)}
          trend={netFlow >= 0 ? 'UP' : 'DOWN'}
        />
      </div>

      {/* Balance Projection */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-sm font-medium">Проекция баланса</h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Начальный баланс</div>
            <div className="mt-1 text-2xl font-semibold">
              {formatPrice(openingBalance)}
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTrendingUp className="size-5" />
            <span className="text-sm">→</span>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Прогноз баланса</div>
            <div className="mt-1 text-2xl font-semibold">
              {formatPrice(closingBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Inflows Breakdown */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h3 className="text-sm font-medium">Притоки по категориям</h3>
        </div>
        <div className="divide-y">
          {inflows.map((inflow, index) => (
            <div key={index} className="flex items-center justify-between p-4">
              <span>{inflow.source}</span>
              <span className="font-medium text-green-600 dark:text-green-500">
                +{formatPrice(inflow.amount)}
              </span>
            </div>
          ))}
          {inflows.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              Нет данных о притоках
            </div>
          )}
        </div>
      </div>

      {/* Outflows Breakdown */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h3 className="text-sm font-medium">Оттоки по категориям</h3>
        </div>
        <div className="divide-y">
          {outflows.map((outflow, index) => (
            <div key={index} className="flex items-center justify-between p-4">
              <span>{outflow.category}</span>
              <span className="font-medium text-red-600 dark:text-red-500">
                -{formatPrice(outflow.amount)}
              </span>
            </div>
          ))}
          {outflows.length === 0 && (
            <div className="p-4 text-center text-muted-foreground">
              Нет данных об оттоках
            </div>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Прогноз основан на текущих данных денежного потока за выбранный период.
            Для более точных прогнозов используйте данные за более длительный период.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// SUMMARY CARD
// ============================================

interface ISummaryCardProps {
  label: string
  value: string
  trend: 'UP' | 'DOWN'
}

function SummaryCard({ label, value, trend }: ISummaryCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={`mt-1 text-2xl font-semibold ${
          trend === 'UP'
            ? 'text-green-600 dark:text-green-500'
            : 'text-red-600 dark:text-red-500'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

// ============================================
// SKELETON
// ============================================

function ForecastSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-32 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
      <Skeleton className="h-48 rounded-lg" />
    </div>
  )
}
