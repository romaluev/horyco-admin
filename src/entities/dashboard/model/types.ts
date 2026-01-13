/**
 * Dashboard Types
 * Based on documentation: /.claude/docs/24-analytics-dashboard.md
 */

import type { GroupBy, KpiType, PeriodType, Trend } from '@/shared/api/graphql'

// ============================================
// DASHBOARD CONFIG TYPES
// ============================================

export interface IKpiSlot {
  position: number
  type: KpiType
  visible: boolean
}

export type WidgetType =
  | 'TOP_PRODUCTS'
  | 'PAYMENT_METHODS'
  | 'CHANNEL_SPLIT'
  | 'STAFF_RANKING'
  | 'HOURLY_BREAKDOWN'
  | 'CUSTOMER_SEGMENTS'
  | 'BRANCH_COMPARISON'
  | 'GOAL_PROGRESS'
  | 'ALERTS'
  | 'REVENUE_OVERVIEW'
  | 'ORDERS_CHART'
  | 'TRANSACTIONS_SUMMARY'
  | 'PERFORMANCE_RADAR'
  | 'DAILY_COMPARISON'
  | 'INCOME_EXPENSE'
  | 'CUSTOMER_RATINGS'
  | 'CONVERSION_FUNNEL'
  | 'ORDERS_BY_CATEGORY'
  | 'ANOMALY_DETECTION'
  | 'VISITORS_TRAFFIC'
  | 'SALES_METRICS'
  | 'GOAL_RADIAL'

export type ChartType = 'area' | 'bar' | 'line' | 'radial' | 'radar'

export interface IDashboardWidget {
  id: string
  type: WidgetType
  position: number
  config: Record<string, unknown> | null
}

export interface IDashboardConfig {
  kpiSlots: IKpiSlot[]
  chartMetric: KpiType
  chartType?: ChartType
  chartGroupBy: GroupBy | null
  widgets: IDashboardWidget[]
}

export interface IDashboardConfigInput {
  kpiSlots: IKpiSlot[]
  chartMetric: KpiType
  chartType?: ChartType
  chartGroupBy: GroupBy | null
  widgets: Omit<IDashboardWidget, 'config'>[]
}

// ============================================
// KPI METRICS TYPES
// ============================================

export interface IKpiMetricValue {
  type: KpiType
  value: number
  previousValue: number
  changePercent: number
  trend: Trend
  formattedValue: string
  periodLabel: string
  comparisonLabel: string
}

// ============================================
// TIME SERIES TYPES
// ============================================

export interface ITimeSeriesPoint {
  timestamp: string
  value: number
  label: string
  isHighlighted: boolean
}

export interface ITimeSeriesData {
  metric: KpiType
  groupBy: GroupBy
  totalValue: number
  changePercent: number
  points: ITimeSeriesPoint[]
}

// ============================================
// WIDGET DATA TYPES
// ============================================

export interface IRankedItem {
  rank: number
  id: number
  name: string
  value: number
  formattedValue: string
  percentage: number
  secondaryValue?: number
  secondaryLabel?: string
}

export interface IProportionSegment {
  key: string
  label: string
  value: number
  percentage: number
  color?: string
}

export interface IProportionsData {
  total: number
  formattedTotal: string
  segments: IProportionSegment[]
}

export interface IHeatmapCell {
  hour: number
  dayOfWeek: number
  value: number
  label: string
}

export interface IHeatmapData {
  cells: IHeatmapCell[]
  maxValue: number
  minValue: number
}

export interface IGoalProgress {
  id: string
  name: string
  target: number
  current: number
  percentage: number
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND'
}

export interface IGoalsSummary {
  goals: IGoalProgress[]
  completedCount: number
  totalCount: number
}

export interface IAlert {
  id: string
  type: 'WARNING' | 'INFO' | 'ERROR'
  message: string
  timestamp: string
  isRead: boolean
}

export interface IAlertSummary {
  alerts: IAlert[]
  unreadCount: number
  totalCount: number
}

// ============================================
// ENTITLEMENTS
// ============================================

export interface IEntitlements {
  analytics_basic: boolean
  analytics_pro: boolean
  analytics_full: boolean
  dashboard_custom: boolean
}

// ============================================
// QUERY PARAMS
// ============================================

export interface IPeriodInput {
  type: PeriodType
  customStart?: string
  customEnd?: string
}

export interface IKpiMetricsParams {
  types: KpiType[]
  period: IPeriodInput
  branchId?: number
}

export interface ITimeSeriesParams {
  metric: KpiType
  period: IPeriodInput
  groupBy?: GroupBy
  branchId?: number
}

export interface IRankedListParams {
  dataset: 'PRODUCTS' | 'STAFF'
  period: IPeriodInput
  sortBy?: 'REVENUE' | 'ORDERS' | 'QUANTITY'
  limit?: number
  branchId?: number
}

export interface IProportionsParams {
  dimension: 'PAYMENT_METHOD' | 'CHANNEL'
  period: IPeriodInput
  branchId?: number
}

export interface IHeatmapParams {
  period: IPeriodInput
  metric?: KpiType
  branchId?: number
}
