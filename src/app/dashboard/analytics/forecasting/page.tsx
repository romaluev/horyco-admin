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
import { useTranslation } from 'react-i18next'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { Skeleton } from '@/shared/ui/base/skeleton'

import {
  useCashFlow,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

// ============================================
// MAIN COMPONENT
// ============================================

export default function ForecastingPage() {
  const { t } = useTranslation('analytics')
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
      title={t('forecasting.title')}
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

// API response structure from the server
interface ICashFlowApiResponse {
  periodStart: string
  periodEnd: string
  totalInflow: number
  totalOutflow: number
  netCashFlow: number
  dailyFlow: {
    date: string
    inflow: number
    outflow: number
    netFlow: number
    runningBalance: number
  }[]
  paymentMethodBreakdown: {
    method: string
    amount: number
    share: number
  }[]
  cashToCardRatio: number
  peakDay: {
    date: string
    amount: number
  }
  averageDailyFlow: number
}

interface IForecastContentProps {
  data: unknown
}

function ForecastContent({ data: rawData }: IForecastContentProps) {
  const { t } = useTranslation('analytics')
  // Cast to the actual API response structure
  const data = rawData as ICashFlowApiResponse

  const totalInflow = data.totalInflow ?? 0
  const totalOutflow = data.totalOutflow ?? 0
  const netCashFlow = data.netCashFlow ?? 0
  const dailyFlow = data.dailyFlow ?? []
  const averageDailyFlow = data.averageDailyFlow ?? 0
  const peakDay = data.peakDay

  // Calculate opening and closing balance from daily flow
  const firstDay = dailyFlow[0]
  const lastDay = dailyFlow[dailyFlow.length - 1]
  const openingBalance = firstDay
    ? firstDay.runningBalance - firstDay.netFlow
    : 0
  const closingBalance = lastDay ? lastDay.runningBalance : 0

  // Get last 7 days for chart
  const last7Days = dailyFlow.slice(-7)

  return (
    <div className="space-y-6">
      {/* Cash Flow Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <SummaryCard
          label={t('forecasting.cashFlow.totalInflow')}
          value={formatPrice(totalInflow)}
          trend="UP"
        />
        <SummaryCard
          label={t('forecasting.cashFlow.totalOutflow')}
          value={formatPrice(totalOutflow)}
          trend="DOWN"
        />
        <SummaryCard
          label={t('forecasting.cashFlow.netCashFlow')}
          value={formatPrice(netCashFlow)}
          trend={netCashFlow >= 0 ? 'UP' : 'DOWN'}
        />
        <SummaryCard
          label={t('forecasting.cashFlow.avgDailyFlow')}
          value={formatPrice(averageDailyFlow)}
          trend="UP"
        />
      </div>

      {/* Balance Projection */}
      <div className="rounded-lg border p-6">
        <h3 className="mb-4 text-sm font-medium">
          {t('forecasting.balance.title')}
        </h3>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              {t('forecasting.balance.opening')}
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatPrice(openingBalance)}
            </div>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <IconTrendingUp className="size-5" />
            <span className="text-sm">→</span>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-sm">
              {t('forecasting.balance.closing')}
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {formatPrice(closingBalance)}
            </div>
          </div>
        </div>
      </div>

      {/* Peak Day */}
      {peakDay && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-medium">
            {t('forecasting.peakDay')}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              {new Date(peakDay.date).toLocaleDateString('ru-RU')}
            </span>
            <span className="text-xl font-semibold text-green-600 dark:text-green-500">
              {formatPrice(peakDay.amount)}
            </span>
          </div>
        </div>
      )}

      {/* Daily Flow Table */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <h3 className="text-sm font-medium">{t('forecasting.dailyFlow')}</h3>
        </div>
        <div className="divide-y">
          {last7Days.map((day, index) => (
            <div key={index} className="flex items-center justify-between p-4">
              <div>
                <span className="font-medium">
                  {new Date(day.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-green-600 dark:text-green-500">
                  +{formatPrice(day.inflow)}
                </span>
                <span className="text-red-600 dark:text-red-500">
                  -{formatPrice(day.outflow)}
                </span>
                <span
                  className={`font-medium ${day.netFlow >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
                >
                  {day.netFlow >= 0 ? '+' : ''}
                  {formatPrice(day.netFlow)}
                </span>
                <span className="text-muted-foreground">
                  {t('forecasting.balanceText', {
                    amount: formatPrice(day.runningBalance),
                  })}
                </span>
              </div>
            </div>
          ))}
          {last7Days.length === 0 && (
            <div className="text-muted-foreground p-4 text-center">
              {t('forecasting.noFlowData')}
            </div>
          )}
        </div>
      </div>

      {/* Full Daily Flow (collapsed) */}
      {dailyFlow.length > 7 && (
        <details className="rounded-lg border">
          <summary className="cursor-pointer border-b p-4 font-medium">
            {t('forecasting.allDays', { count: dailyFlow.length })}
          </summary>
          <div className="divide-y">
            {dailyFlow.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <span className="font-medium">
                    {new Date(day.date).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-green-600 dark:text-green-500">
                    +{formatPrice(day.inflow)}
                  </span>
                  <span className="text-red-600 dark:text-red-500">
                    -{formatPrice(day.outflow)}
                  </span>
                  <span
                    className={`font-medium ${day.netFlow >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}
                  >
                    {day.netFlow >= 0 ? '+' : ''}
                    {formatPrice(day.netFlow)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatPrice(day.runningBalance)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}

      {/* Info Note */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <IconInfoCircle className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <div>
          <p className="text-sm text-blue-800 dark:text-blue-300">
            {t('forecasting.note')}
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
      <div className="text-muted-foreground text-sm">{label}</div>
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
