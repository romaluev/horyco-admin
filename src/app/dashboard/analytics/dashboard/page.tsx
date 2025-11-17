/**
 * Analytics Dashboard Page
 * Route: /dashboard/analytics/dashboard
 */

'use client'

import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useDashboardAnalytics, analyticsKeys } from '@/entities/analytics'
import { useAnalyticsFilters } from '@/features/analytics-dashboard'

import { DashboardContent } from './dashboard-content'
import { ErrorState } from './error-state'
import { DashboardSkeleton } from './skeleton'

const MINUTES_TO_MS = 60 * 1000
const AUTO_REFRESH_MINUTES = 5
const AUTO_REFRESH_INTERVAL_MS = AUTO_REFRESH_MINUTES * MINUTES_TO_MS

const getPeriodLabel = (period: string, compareData?: {
  startDate: string
  endDate: string
}): string => {
  if (period === 'day') return 'vs yesterday'
  if (period === 'week') return 'vs last week'
  if (period === 'month') return 'vs last month'
  if (period === 'custom' && compareData) {
    return `vs ${compareData.startDate} — ${compareData.endDate}`
  }
  return 'vs previous period'
}

export default function AnalyticsDashboardPage() {
  const queryClient = useQueryClient()
  const { filters, setPeriod, setCustomDateRange, setScope, setGroupBy } =
    useAnalyticsFilters()

  const { data, isLoading, isRefetching, error } =
    useDashboardAnalytics(filters)

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      queryClient.invalidateQueries({
        queryKey: analyticsKeys.dashboard(filters),
      })
    }, AUTO_REFRESH_INTERVAL_MS)

    return () => clearInterval(intervalId)
  }, [filters, queryClient])

  const handleRefresh = () => {
    queryClient.invalidateQueries({
      queryKey: analyticsKeys.dashboard(filters),
    })
  }

  if (isLoading) return <DashboardSkeleton />

  if (error) return <ErrorState error={error} onRetry={handleRefresh} />

  if (!data) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <p className="text-muted-foreground">No data available</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardContent
      data={data}
      isRefreshing={isRefetching}
      periodLabel={getPeriodLabel(filters.period, data.period.compareTo)}
      currentGroupBy={filters.groupBy}
      onPeriodChange={setPeriod}
      onCustomRangeChange={setCustomDateRange}
      onScopeChange={setScope}
      onGroupByChange={setGroupBy}
      onRefresh={handleRefresh}
      filters={filters}
    />
  )
}
