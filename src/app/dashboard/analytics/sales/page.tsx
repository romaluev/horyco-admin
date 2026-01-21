/**
 * Sales Overview Page
 * Based on docs: 25-analytics-pages.md - Part 1: Sales Overview
 *
 * BASIC tier - Available to all plans
 * Shows summary metrics table with comparison to previous period
 */

'use client'

import * as React from 'react'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import {
  useSalesOverview,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/dashboard/analytics'

export default function SalesOverviewPage() {
  const { t } = useTranslation('dashboard')
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.TODAY)

  const { data, isLoading, error, refetch } = useSalesOverview({
    period: { type: period },
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export sales overview')
  }

  return (
    <AnalyticsPageLayout
      pageCode="sales"
      title={t('sales.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      {isLoading ? (
        <SalesOverviewSkeleton />
      ) : error ? (
        <AnalyticsErrorState onRetry={() => refetch()} />
      ) : data ? (
        <SalesOverviewContent data={data} />
      ) : null}
    </AnalyticsPageLayout>
  )
}

// ============================================
// CONTENT COMPONENT
// ============================================

interface ISalesOverviewContentProps {
  data: {
    summary: {
      grossSales: number
      refunds: number
      discounts: number
      netRevenue: number
      tips: number
      orderCount: number
      avgCheck: number
    }
    changes: {
      revenue: number
      orders: number
      avgCheck: number
      discounts: number
    }
  }
}

function SalesOverviewContent({ data }: ISalesOverviewContentProps) {
  const { t } = useTranslation('dashboard')
  const summary = data.summary ?? {}
  const changes = data.changes ?? {}

  // Extract values with defensive checks
  const grossSales = summary.grossSales ?? 0
  const refunds = summary.refunds ?? 0
  const discounts = summary.discounts ?? 0
  const netRevenue = summary.netRevenue ?? 0
  const tips = summary.tips ?? 0
  const orderCount = summary.orderCount ?? 0
  const avgCheck = summary.avgCheck ?? 0

  const revenueChange = changes.revenue ?? 0
  const ordersChange = changes.orders ?? 0
  const avgCheckChange = changes.avgCheck ?? 0
  const discountsChange = changes.discounts ?? 0

  // Calculate previous values from changes (with defensive checks to avoid division by zero)
  const calcPrevious = (current: number, changePercent: number): number => {
    if (changePercent === -100) return 0
    return current / (1 + changePercent / 100)
  }

  const previousNetRevenue = calcPrevious(netRevenue, revenueChange)
  const previousOrders = calcPrevious(orderCount, ordersChange)
  const previousAvgCheck = calcPrevious(avgCheck, avgCheckChange)
  const previousDiscounts = calcPrevious(discounts, discountsChange)
  const previousGrossSales = previousNetRevenue + previousDiscounts + calcPrevious(refunds, revenueChange)

  const rows = [
    {
      label: t('sales.table.grossSales'),
      current: grossSales,
      previous: previousGrossSales,
      change: revenueChange,
      format: 'currency' as const,
    },
    {
      label: t('sales.table.refunds'),
      current: -refunds,
      previous: -calcPrevious(refunds, revenueChange),
      change: revenueChange,
      format: 'currency' as const,
      isNegative: true,
    },
    {
      label: t('sales.table.discounts'),
      current: -discounts,
      previous: -previousDiscounts,
      change: discountsChange,
      format: 'currency' as const,
      isNegative: true,
    },
    {
      label: t('sales.table.netRevenue'),
      current: netRevenue,
      previous: previousNetRevenue,
      change: revenueChange,
      format: 'currency' as const,
      isHighlighted: true,
    },
    {
      label: t('sales.table.orders'),
      current: orderCount,
      previous: previousOrders,
      change: ordersChange,
      format: 'number' as const,
    },
    {
      label: t('sales.table.avgCheck'),
      current: avgCheck,
      previous: previousAvgCheck,
      change: avgCheckChange,
      format: 'currency' as const,
    },
    {
      label: t('sales.table.tips'),
      current: tips,
      previous: calcPrevious(tips, revenueChange),
      change: revenueChange,
      format: 'currency' as const,
    },
  ]

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">{t('sales.table.metric')}</TableHead>
            <TableHead className="text-right">{t('sales.table.today')}</TableHead>
            <TableHead className="text-right">{t('sales.table.yesterday')}</TableHead>
            <TableHead className="text-right">{t('sales.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.label}
              className={cn(row.isHighlighted && 'bg-muted/50 font-medium')}
            >
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-right">
                {row.format === 'currency'
                  ? formatPrice(row.current)
                  : row.current.toLocaleString('ru-RU')}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {row.format === 'currency'
                  ? formatPrice(row.previous)
                  : Math.round(row.previous).toLocaleString('ru-RU')}
              </TableCell>
              <TableCell className="text-right">
                <ChangeIndicator value={row.change} inverted={row.isNegative} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// CHANGE INDICATOR
// ============================================

interface IChangeIndicatorProps {
  value: number
  inverted?: boolean
}

function ChangeIndicator({ value, inverted = false }: IChangeIndicatorProps) {
  const isPositive = inverted ? value < 0 : value > 0
  const isNegative = inverted ? value > 0 : value < 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-500',
        isNegative && 'text-red-600 dark:text-red-500'
      )}
    >
      {isPositive && <IconTrendingUp className="size-4" />}
      {isNegative && <IconTrendingDown className="size-4" />}
      {value > 0 ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}

// ============================================
// SKELETON
// ============================================

function SalesOverviewSkeleton() {
  const { t } = useTranslation('dashboard')
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">{t('sales.table.metric')}</TableHead>
            <TableHead className="text-right">{t('sales.table.today')}</TableHead>
            <TableHead className="text-right">{t('sales.table.yesterday')}</TableHead>
            <TableHead className="text-right">{t('sales.table.change')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 7 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-24" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
