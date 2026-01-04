/**
 * Analytics Feature Types
 * Based on docs: 23-analytics-reporting.md, 29-analytics-integration-guide.md (updated 2025-12-28)
 */

import type { GroupBy, PeriodType, SortBy, SortDirection } from '@/shared/api/graphql'

// ============================================
// PAGE CODES
// ============================================

export type AnalyticsPageCode =
  | 'sales'
  | 'products'
  | 'categories'
  | 'payments'
  | 'staff'
  | 'customers'
  | 'heatmap'
  | 'channels'
  | 'branches'
  | 'financial'
  | 'forecasting'
  | 'alerts'

// ============================================
// ENTITLEMENT TIERS
// ============================================

export type EntitlementTier = 'analytics_basic' | 'analytics_pro' | 'analytics_full'

export interface IPageAccessConfig {
  pageCode: AnalyticsPageCode
  requiredTier: EntitlementTier
  title: string
  titleEn: string
  description: string
  icon: string
  upgradeFeatures: string[]
}

// ============================================
// DEFAULT VIEW TYPES
// ============================================

export interface IDefaultViewConfig {
  timeframe: {
    type: PeriodType
    customStart?: string
    customEnd?: string
  }
  filters?: Record<string, unknown>
  columns: string[]
  groupBy?: GroupBy
  sorting: {
    column: SortBy | string
    direction: SortDirection
  }
  display?: IViewDisplayConfig
}

export interface IViewDisplayConfig {
  mode: 'table' | 'overview'
  kpis?: string[]
  chart?: {
    enabled: boolean
    metric: string
    type: 'line' | 'bar'
  }
}

export interface IDefaultView {
  id: string
  name: string
  nameEn: string
  pageCode: AnalyticsPageCode
  isDefault: true
  isPinned: false
  isShared: false
  config: IDefaultViewConfig
}

// ============================================
// ANALYTICS PAGE PROPS
// ============================================

export interface IAnalyticsPageProps {
  period: {
    type: PeriodType
    customStart?: string
    customEnd?: string
  }
  branchId?: number
  viewId?: string
}

// ============================================
// COMMON RESPONSE TYPES
// Per doc 23: Many analytics responses include scope and period
// ============================================

export type AnalyticsScope = 'BRANCH' | 'TENANT'

export interface IAnalyticsChange {
  percent: number
  trend: 'UP' | 'DOWN' | 'NEUTRAL'
  absolute: number
}

export interface IAnalyticsPeriodInfo {
  type?: string
  startDate: string
  endDate: string
  label?: string
  compareTo?: {
    startDate: string
    endDate: string
  }
}

// ============================================
// SALES OVERVIEW TYPES
// ============================================

export interface ISalesOverviewSummary {
  grossSales: number
  refunds: number
  discounts: number
  netRevenue: number
  tips: number
  orderCount: number
  avgCheck: number
}

export interface ISalesOverviewChanges {
  revenue: number
  orders: number
  avgCheck: number
  discounts: number
}

export interface ISalesOverviewHourly {
  hour: number
  revenue: number
  orders: number
}

export interface ISalesOverviewData {
  summary: ISalesOverviewSummary
  changes: ISalesOverviewChanges
  hourlyBreakdown: ISalesOverviewHourly[]
}

// ============================================
// PRODUCT ANALYTICS TYPES
// Per doc 23: Typed response with scope, period, summary, products, pagination
// ============================================

export interface IProductAnalyticsItem {
  id: number
  productId: number
  name: string
  categoryId: number
  categoryName: string
  revenue: number
  orders: number
  quantity: number
  avgPrice: number
  revenueShare?: number
  share: number
  revenueChange?: IAnalyticsChange
  change?: IAnalyticsChange
  trend: 'UP' | 'DOWN' | 'NEUTRAL'
  rank: number
  abcClass: 'A' | 'B' | 'C'
}

export interface IProductAnalyticsSummary {
  totalProducts: number
  uniqueProducts: number
  totalRevenue: number
  totalOrders: number
  totalQuantity: number
  avgPrice: number
  revenueChange?: IAnalyticsChange
  changes: {
    revenue: number
    quantity: number
    products: number
    avgPrice: number
  }
}

export interface IProductAnalyticsPagination {
  total: number
  offset: number
  limit: number
}

export interface IProductAnalyticsData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  summary: IProductAnalyticsSummary
  products: IProductAnalyticsItem[]
  pagination: IProductAnalyticsPagination
}

// ============================================
// CATEGORY ANALYTICS TYPES
// Per doc 23: Returns typed response with scope, period, summary, categories
// ============================================

export interface ICategoryAnalyticsItem {
  categoryId: number
  name: string
  revenue: number
  orders: number
  quantity: number
  avgCheck: number
  revenueShare: number
  ordersShare: number
  revenueChange?: IAnalyticsChange
  productCount: number
  abcClass: 'A' | 'B' | 'C'
}

export interface ICategoryAnalyticsData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  summary: {
    totalCategories: number
    totalRevenue: number
    totalOrders: number
    revenueChange?: IAnalyticsChange
  }
  categories: ICategoryAnalyticsItem[]
}

// ============================================
// PAYMENT METHODS ANALYTICS TYPES
// Per doc 23: Typed response with scope, period, summary, methods
// ============================================

export interface IPaymentMethodItem {
  method: string
  label: string
  amount: number
  transactions: number
  share: number
  avgAmount: number
  color: string
  change?: IAnalyticsChange
}

export interface IPaymentMethodsAnalyticsData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  summary: {
    totalAmount: number
    totalTransactions: number
    changes: {
      total: number
      cash: number
      card: number
      online: number
    }
  }
  methods: IPaymentMethodItem[]
}

// ============================================
// STAFF ANALYTICS TYPES
// Per doc 23: Returns typed response with scope, period, summary, staff
// ============================================

export interface IStaffAnalyticsItem {
  employeeId: number
  name: string
  roleCode: string
  revenue: number
  orders: number
  avgCheck: number
  tips: number
  refunds: number
  voids: number
  revenueShare: number
  rank: number
  revenueChange?: IAnalyticsChange
}

export interface IStaffAnalyticsData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  summary: {
    totalStaff: number
    totalRevenue: number
    totalOrders: number
    totalTips: number
    avgRevenuePerStaff: number
  }
  staff: IStaffAnalyticsItem[]
}

// ============================================
// CUSTOMER ANALYTICS TYPES
// Per doc 23: Returns GraphQL JSON
// ============================================

export interface ICustomerSegment {
  segment: string
  segmentLabel: string
  count: number
  share: number
  revenue: number
}

export interface ICustomerOverviewData {
  summary: {
    totalCustomers: number
    activeCustomers: number
    newCustomers: number
    returningCustomers: number
    churnedCustomers: number
  }
  metrics: {
    activeRate: number
    retentionRate: number
    churnRate: number
    avgOrdersPerCustomer: number
    avgRevenuePerCustomer: number
  }
  segments: ICustomerSegment[]
}

export interface IRfmSegmentData {
  segment: string
  segmentLabel: string
  description?: string
  count: number
  share: number
  avgRecency?: number
  avgFrequency?: number
  avgMonetary?: number
  avgR?: number
  avgF?: number
  avgM?: number
  recommendations?: string[]
}

export interface IRfmAnalysisData {
  segments: IRfmSegmentData[]
  distribution: {
    r?: number[]
    f?: number[]
    m?: number[]
    recency?: number[]
    frequency?: number[]
    monetary?: number[]
  }
}

export interface ICohortRetention {
  period: number
  activeCount: number
  retentionRate: number
  revenue: number
}

export interface ICohortData {
  cohortDate: string
  cohortLabel: string
  initialSize: number
  retention: ICohortRetention[]
}

export interface ICohortAnalysisData {
  cohorts: ICohortData[]
  avgRetention: {
    period1: number
    period3: number
    period6: number
  }
}

// ============================================
// HEATMAP TYPES
// Per doc 23: Returns typed response with scope, period, cells
// ============================================

export interface IHeatmapCell {
  dayOfWeek: number
  hour: number
  value: number
  intensity: number
}

export interface IHeatmapData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  metric: string
  maxValue: number
  minValue: number
  peakHour: number
  peakDay: number
  cells: IHeatmapCell[]
}

// ============================================
// CHANNELS ANALYTICS TYPES
// Per doc 23: Returns typed response with scope, period, channels
// ============================================

export interface IChannelItem {
  channel: string
  label: string
  orders: number
  revenue: number
  ordersShare: number
  revenueShare: number
  avgCheck: number
  color: string
  ordersChange?: IAnalyticsChange
}

export interface IChannelsAnalyticsData {
  scope: AnalyticsScope
  period: IAnalyticsPeriodInfo
  totalOrders: number
  totalRevenue: number
  channels: IChannelItem[]
}

// ============================================
// BRANCH ANALYTICS TYPES (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

export interface IBranchComparisonItem {
  id: number
  name: string
  revenue: number
  orders: number
  avgCheck: number
  vsAvg: number
}

export interface IBranchComparisonData {
  branches: IBranchComparisonItem[]
  networkAvg: {
    revenue: number
    orders: number
    avgCheck: number
  }
}

export interface IBranchBenchmarkData {
  branches: Array<{
    id: number
    name: string
    metrics: {
      revenue: number
      orders: number
      avgCheck: number
      customerCount: number
      retentionRate: number
    }
  }>
}

export interface IBranchTrendPoint {
  date: string
  revenue: number
  orders: number
}

export interface IBranchTrendsData {
  branches: Array<{
    id: number
    name: string
    trend: IBranchTrendPoint[]
  }>
}

// ============================================
// FINANCIAL ANALYTICS TYPES (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

export interface IProfitLossItem {
  label: string
  currentValue: number
  previousValue: number
  change: number
  isTotal?: boolean
}

export interface IProfitLossData {
  revenue: IProfitLossItem[]
  expenses: IProfitLossItem[]
  netProfit: number
  previousNetProfit: number
  profitMargin: number
  previousProfitMargin: number
}

export interface IMarginItem {
  id: number
  name: string
  cost: number
  price: number
  margin: number
  marginClass: 'HIGH' | 'MEDIUM' | 'LOW' | 'NEGATIVE'
}

export interface IMarginAnalysisData {
  summary: {
    avgMargin: number
    highMarginCount: number
    lowMarginCount: number
    negativeCount: number
  }
  products: IMarginItem[]
}

export interface ICashFlowInflow {
  source: string
  amount: number
  date: string
}

export interface ICashFlowOutflow {
  category: string
  amount: number
  date: string
}

export interface ICashFlowData {
  inflows: ICashFlowInflow[]
  outflows: ICashFlowOutflow[]
  netFlow: number
  openingBalance: number
  closingBalance: number
}

export interface IRevenueBreakdownItem {
  key: string
  label: string
  value: number
  percentage: number
}

export interface IRevenueBreakdownData {
  total: number
  breakdown: IRevenueBreakdownItem[]
}

// ============================================
// ALERTS TYPES (ULTRA)
// Per doc 23: Returns GraphQL JSON
// alertSummary returns healthScore structure, not alerts list
// ============================================

export type AlertType =
  | 'REVENUE_DROP'
  | 'HIGH_REFUNDS'
  | 'LOW_INVENTORY'
  | 'STAFF_PERFORMANCE'
  | 'CUSTOMER_CHURN'
  | 'ANOMALY_DETECTED'
  | 'GOAL_AT_RISK'

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO'

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'

export interface IAlertItem {
  id: string
  type: AlertType
  severity: AlertSeverity
  title: string
  message: string
  detectedAt: string
  branchId?: number
  branchName?: string
  metadata?: Record<string, unknown>
}

/**
 * AlertSummary response structure
 * Per doc 23: alertSummary returns JSON with healthScore
 */
export interface IAlertSummaryData {
  healthScore: number
  healthStatus: 'healthy' | 'warning' | 'critical'
  activeAlerts: {
    critical: number
    warning: number
    info: number
  }
  weeklyTrend: {
    alertsTriggered: number
    alertsResolved: number
    avgResolutionTime: number
  }
}

/**
 * Alerts list response (from alerts query, not alertSummary)
 * Per doc 23: Returns GraphQL JSON - the array directly
 */
export type IAlertsData = IAlertItem[]

export interface IAlertSettings {
  revenueDropThreshold: number
  refundSpikeThreshold: number
  discountAbuseThreshold: number
  emailNotifications: boolean
}

export interface IAnomalyItem {
  id: string
  metric: string
  detectedAt: string
  expectedValue: number
  actualValue: number
  deviation: number
  severity: AlertSeverity
}

export interface IAnomalyDetectionData {
  anomalies: IAnomalyItem[]
}

// ============================================
// KPI TYPES
// Per doc 23: For dashboard KPI cards
// ============================================

export type Trend = 'UP' | 'DOWN' | 'NEUTRAL'

export interface IKpiMetric {
  value: number
  previousValue?: number
  changePercent?: number
  trend?: Trend
  formattedValue?: string
  periodLabel?: string
  comparisonLabel?: string
}

// ============================================
// TIME SERIES TYPES
// Per doc 23: For charts
// ============================================

export interface ITimeSeriesPoint {
  timestamp: string
  value: number
  label?: string
  isHighlighted?: boolean
}

export interface ITimeSeriesData {
  metric: string
  groupBy: GroupBy
  totalValue: number
  changePercent?: number
  points: ITimeSeriesPoint[]
}

// ============================================
// RANKED LIST TYPES
// Per doc 23: For top products, staff, etc.
// ============================================

export interface IRankedItem {
  rank: number
  id: number
  name: string
  value: number
  formattedValue?: string
  percentage: number
  secondaryValue?: number
  secondaryLabel?: string
  color?: string
}

// ============================================
// PROPORTIONS TYPES
// Per doc 23: For pie/donut charts
// ============================================

export interface IProportionSegment {
  key: string
  label: string
  value: number
  percentage: number
  color?: string
}

export interface IProportionsData {
  total: number
  formattedTotal?: string
  segments: IProportionSegment[]
}

// ============================================
// EXPORT TYPES
// ============================================

export type ExportFormat = 'CSV' | 'XLSX' | 'PDF'

export type ReportType =
  | 'DASHBOARD'
  | 'PRODUCTS'
  | 'CATEGORIES'
  | 'CUSTOMERS'
  | 'STAFF'
  | 'FINANCIAL'
  | 'BRANCHES'

export interface IExportReportResult {
  downloadUrl: string
  expiresAt: string
}
