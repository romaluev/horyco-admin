/**
 * Analytics Dashboard Types
 * Based on API spec: GET /admin/analytics/dashboard
 */

export type AnalyticsPeriodType = 'day' | 'week' | 'month' | 'custom'
export type AnalyticsGroupBy = 'hour' | 'day' | 'week'
export type AnalyticsScopeType = 'branch' | 'all_branches'

export type PaymentMethod =
  | 'CASH'
  | 'CARD'
  | 'CREDIT'
  | 'PAYME'
  | 'CLICK'
  | 'UZUM'
  | 'BANK_TRANSFER'
  | 'MIXED'

export type OrderStatus = 'PAID' | 'PARTIALLY_PAID' | 'NOT_PAID'

export interface IAnalyticsBranch {
  id: number
  name: string
}

export interface IAnalyticsPeriod {
  type: AnalyticsPeriodType
  startDate: string // ISO date YYYY-MM-DD
  endDate: string // ISO date YYYY-MM-DD
  compareTo: {
    startDate: string
    endDate: string
  }
}

export interface IAnalyticsTopProduct {
  productId: number
  name: string
  orders: number
  revenue: number
  sharePct: number
}

export interface IAnalyticsSummary {
  revenue: number
  revenueChangePct: number | null
  orders: number
  ordersChangePct: number | null
  avgCheck: number
  avgCheckChangePct: number | null
  topProduct: IAnalyticsTopProduct | null
}

export interface IAnalyticsChartPoint {
  timestamp: string // ISO datetime
  revenue: number
  orders: number
}

export interface IAnalyticsChart {
  groupBy: AnalyticsGroupBy
  points: IAnalyticsChartPoint[]
}

export interface IAnalyticsRecentOrder {
  orderId: number
  number: string
  branch: IAnalyticsBranch | null // null in single-branch mode
  createdAt: string // ISO datetime
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
}

export interface IDashboardAnalyticsResponse {
  scope: AnalyticsScopeType
  branch: IAnalyticsBranch | null // null if scope=all_branches
  period: IAnalyticsPeriod
  summary: IAnalyticsSummary
  chart: IAnalyticsChart
  topProducts: IAnalyticsTopProduct[]
  recentOrders: IAnalyticsRecentOrder[]
}

export interface IDashboardAnalyticsParams {
  scope?: AnalyticsScopeType
  /**
   * Optional branch id for single-branch analytics.
   * When omitted, backend may fall back to "current branch".
   */
  branchId?: number
  period?: AnalyticsPeriodType
  startDate?: string // Required if period=custom
  endDate?: string // Required if period=custom
  groupBy?: AnalyticsGroupBy
  timezone?: string
}
