/**
 * Dashboard Content Component
 * Main content area with all dashboard sections
 */

import {
  DashboardHeader,
  KpiCards,
  RevenueChart,
  TopProductsTable,
  RecentOrdersTable,
} from '@/features/analytics-dashboard'

import type {
  IDashboardAnalyticsResponse,
  AnalyticsGroupBy,
  AnalyticsPeriodType,
  AnalyticsScopeType,
} from '@/entities/analytics'

interface IDashboardContentProps {
  data: IDashboardAnalyticsResponse
  isRefreshing: boolean
  periodLabel: string
  currentGroupBy?: AnalyticsGroupBy
  onPeriodChange: (period: AnalyticsPeriodType) => void
  onCustomRangeChange: (startDate: string, endDate: string) => void
  onScopeChange: (scope: AnalyticsScopeType) => void
  onGroupByChange: (groupBy: AnalyticsGroupBy) => void
  onRefresh: () => void
  filters: {
    period: AnalyticsPeriodType
    scope: AnalyticsScopeType
    startDate?: string
    endDate?: string
  }
}

export const DashboardContent = ({
  data,
  isRefreshing,
  periodLabel,
  currentGroupBy,
  onPeriodChange,
  onCustomRangeChange,
  onScopeChange,
  onGroupByChange,
  onRefresh,
  filters,
}: IDashboardContentProps) => {
  return (
    <div className="container mx-auto space-y-8 py-8">
      <DashboardHeader
        period={filters.period}
        scope={filters.scope}
        startDate={filters.startDate}
        endDate={filters.endDate}
        currentBranchId={data.branch?.id}
        isRefreshing={isRefreshing}
        onPeriodChange={onPeriodChange}
        onCustomRangeChange={onCustomRangeChange}
        onScopeChange={onScopeChange}
        onRefresh={onRefresh}
      />

      <KpiCards summary={data.summary} periodLabel={periodLabel} />

      <RevenueChart
        chart={data.chart}
        currentGroupBy={currentGroupBy}
        onGroupByChange={onGroupByChange}
      />

      <TopProductsTable products={data.topProducts} />

      <RecentOrdersTable orders={data.recentOrders} scope={data.scope} />
    </div>
  )
}
