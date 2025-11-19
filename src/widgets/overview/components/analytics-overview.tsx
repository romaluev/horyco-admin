'use client'

import { useEffect, useMemo, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'

import {
  analyticsKeys,
  type AnalyticsPeriodType,
  type AnalyticsScopeType,
  useDashboardAnalytics,
} from '@/entities/analytics'

import { AnalyticsChart, type ChartMetricType } from './analytics-chart'
import { AnalyticsMetrics } from './analytics-metrics'
import { BranchSelector } from './branch-selector'
import {
  PeriodFilter,
  type PeriodFilterDateRange,
  type PeriodType,
} from './period-filter'
import { RecentOrders } from './recent-orders'
import { TopProducts } from './top-products'

const MINUTES_TO_MS = 60 * 1000
const AUTO_REFRESH_MINUTES = 5
const AUTO_REFRESH_MS = AUTO_REFRESH_MINUTES * MINUTES_TO_MS

export function AnalyticsOverview() {
  const queryClient = useQueryClient()
  const [scope, setScope] = useState<AnalyticsScopeType>('branch')
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('day')
  const [selectedRange, setSelectedRange] = useState<PeriodFilterDateRange>({
    from: undefined,
    to: undefined,
  })
  const [selectedMetric, setSelectedMetric] =
    useState<ChartMetricType>('revenue')

  const apiParams = useMemo(() => {
    const params: {
      scope: AnalyticsScopeType
      period: AnalyticsPeriodType
      startDate?: string
      endDate?: string
    } = {
      scope,
      period: selectedPeriod as AnalyticsPeriodType,
    }

    if (selectedPeriod === 'custom' && selectedRange.from && selectedRange.to) {
      params.startDate = format(selectedRange.from, 'yyyy-MM-dd')
      params.endDate = format(selectedRange.to, 'yyyy-MM-dd')
    }

    return params
  }, [scope, selectedPeriod, selectedRange])

  const { data, isLoading, isRefetching } = useDashboardAnalytics(apiParams)

  useEffect(() => {
    const id = setInterval(
      () =>
        queryClient.invalidateQueries({
          queryKey: analyticsKeys.dashboard(apiParams),
        }),
      AUTO_REFRESH_MS
    )
    return () => clearInterval(id)
  }, [apiParams, queryClient])

  const metricsData = useMemo(() => {
    if (!data) return null
    const {
      revenue,
      revenueChangePct,
      orders,
      ordersChangePct,
      avgCheck,
      avgCheckChangePct,
      topProduct,
    } = data.summary
    const calculatePrevious = (
      current: number,
      changePercent: number | null
    ) =>
      changePercent === null
        ? current
        : Math.round(current / (1 + changePercent / 100))

    return {
      revenue,
      ordersCount: orders,
      averageCheck: avgCheck,
      topDish: topProduct
        ? {
            id: String(topProduct.productId),
            name: topProduct.name,
            quantity: topProduct.orders,
            revenue: topProduct.revenue,
          }
        : { id: '0', name: 'Нет данных', quantity: 0, revenue: 0 },
      previousPeriod: {
        revenue: calculatePrevious(revenue, revenueChangePct),
        ordersCount: calculatePrevious(orders, ordersChangePct),
        averageCheck: calculatePrevious(avgCheck, avgCheckChangePct),
      },
    }
  }, [data])

  const chartData = useMemo(() => {
    if (!data) return null

    const dataPoints = data.chart.points.map((point) => {
      const value =
        selectedMetric === 'revenue'
          ? point.revenue
          : selectedMetric === 'orders'
            ? point.orders
            : point.revenue / (point.orders || 1)

      return {
        date: point.timestamp,
        value: Math.round(value),
      }
    })

    return {
      data: dataPoints,
      metric: selectedMetric,
      groupBy: data.chart.groupBy,
    }
  }, [data, selectedMetric])

  const recentOrdersData = useMemo(
    () =>
      data
        ? data.recentOrders.map((order) => ({
            id: String(order.orderId),
            number: order.number,
            createdAt: order.createdAt,
            total: order.total,
            paymentMethod: order.paymentMethod,
            status: order.status,
            branch: order.branch || null,
          }))
        : [],
    [data]
  )

  // if (isLoading || !data || !metricsData || !chartData) {
  //   return (
  //     <div className="min-h-screen space-y-6 pb-8 w-full">
  //       {/* Header section */}
  //       <div className="space-y-4">
  //         <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
  //         <div className="flex flex-wrap items-center gap-4">
  //           <div className="h-10 w-96 animate-pulse rounded-lg bg-muted" />
  //           <div className="h-8 w-px bg-border" />
  //           <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
  //         </div>
  //       </div>
  //
  //
  //     </div>
  //   )
  // }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Обзор продаж</h2>
        <div className="flex flex-wrap items-center gap-4">
          <PeriodFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            selectedRange={selectedRange}
            onDateRangeChange={setSelectedRange}
          />
          <div className="bg-border h-8 w-px" />
          <BranchSelector
            scope={scope}
            onScopeChange={setScope}
            currentBranchName={data?.branch?.name || null}
          />
        </div>
      </div>

      {isLoading || !data || !metricsData || !chartData ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-muted h-36 animate-pulse rounded-lg" />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="bg-muted h-[450px] w-full animate-pulse rounded-lg" />
            </div>
            <div>
              <div className="bg-muted h-[450px] w-full animate-pulse rounded-lg" />
            </div>
          </div>

          <div className="bg-muted h-96 w-full animate-pulse rounded-lg" />
        </>
      ) : (
        <>
          <AnalyticsMetrics
            metrics={metricsData}
            period={selectedPeriod}
            dateRange={selectedRange}
            selectedRange={selectedRange}
            selectedPeriod={selectedPeriod}
            isLoading={isRefetching}
          />

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <AnalyticsChart
                data={chartData}
                onMetricChange={setSelectedMetric}
                isLoading={isRefetching}
              />
            </div>
            <div>
              <RecentOrders
                orders={recentOrdersData}
                compact
                showBranch={scope === 'all_branches'}
              />
            </div>
          </div>

          <TopProducts products={data.topProducts} />
        </>
      )}
    </div>
  )
}
