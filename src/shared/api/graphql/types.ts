/**
 * GraphQL Types for Analytics API
 * Based on API documentation: /.claude/docs/23-analytics-reporting.md
 */

// ============================================
// ENUMS
// ============================================

export enum Dataset {
  ORDERS = 'ORDERS',
  PRODUCTS = 'PRODUCTS',
  CATEGORIES = 'CATEGORIES',
  STAFF = 'STAFF',
  CHANNELS = 'CHANNELS',
  PAYMENT_METHODS = 'PAYMENT_METHODS',
  DELIVERY_TYPES = 'DELIVERY_TYPES',
  CUSTOMERS = 'CUSTOMERS',
  BRANCHES = 'BRANCHES',
}

export enum PeriodType {
  TODAY = 'TODAY',
  YESTERDAY = 'YESTERDAY',
  THIS_WEEK = 'THIS_WEEK',
  LAST_WEEK = 'LAST_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  LAST_MONTH = 'LAST_MONTH',
  LAST_7_DAYS = 'LAST_7_DAYS',
  LAST_30_DAYS = 'LAST_30_DAYS',
  LAST_90_DAYS = 'LAST_90_DAYS',
  THIS_QUARTER = 'THIS_QUARTER',
  LAST_QUARTER = 'LAST_QUARTER',
  THIS_YEAR = 'THIS_YEAR',
  LAST_YEAR = 'LAST_YEAR',
  CUSTOM = 'CUSTOM',
}

export enum GroupBy {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  QUARTER = 'QUARTER',
  YEAR = 'YEAR',
}

export enum SortBy {
  REVENUE = 'REVENUE',
  ORDERS = 'ORDERS',
  QUANTITY = 'QUANTITY',
  PERCENTAGE = 'PERCENTAGE',
  AVG_CHECK = 'AVG_CHECK',
  CUSTOMERS = 'CUSTOMERS',
  GROWTH = 'GROWTH',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum KpiType {
  REVENUE = 'REVENUE',
  ORDERS = 'ORDERS',
  AVG_CHECK = 'AVG_CHECK',
  CUSTOMERS = 'CUSTOMERS',
  NEW_CUSTOMERS = 'NEW_CUSTOMERS',
  RETURNING_CUSTOMERS = 'RETURNING_CUSTOMERS',
  TIPS = 'TIPS',
  REFUNDS = 'REFUNDS',
  CANCELLATIONS = 'CANCELLATIONS',
  MARGIN = 'MARGIN',
  RETENTION_RATE = 'RETENTION_RATE',
  STAFF_PRODUCTIVITY = 'STAFF_PRODUCTIVITY',
}

export enum Trend {
  UP = 'UP',
  DOWN = 'DOWN',
  NEUTRAL = 'NEUTRAL',
}

// ============================================
// INPUT TYPES
// ============================================

export interface IPeriodInput {
  type: PeriodType
  customStart?: string // Format: YYYY-MM-DD
  customEnd?: string // Format: YYYY-MM-DD
}

export interface ISortingInput {
  column: string
  direction: SortDirection
}

export interface IViewConfigInput {
  timeframe: IPeriodInput
  filters?: string // JSON string of filters
  columns?: string[]
  groupBy?: GroupBy
  sorting?: ISortingInput
  display?: string
}

export interface ICreateViewInput {
  pageCode: string
  name: string
  config: IViewConfigInput
  isPinned?: boolean
}

export interface IUpdateViewInput {
  name?: string
  config?: IViewConfigInput
  isPinned?: boolean
  isShared?: boolean
}

// ============================================
// OUTPUT TYPES
// ============================================

export interface IView {
  id: string
  name: string
  pageCode: string
  isDefault: boolean
  isPinned: boolean
  isShared: boolean
  config: IViewConfigOutput
  createdAt: string
  updatedAt?: string
}

export interface IViewConfigOutput {
  timeframe: {
    type: PeriodType
    customStart?: string
    customEnd?: string
  }
  filters?: string
  columns?: string[]
  groupBy?: GroupBy
  sorting?: {
    column: string
    direction: SortDirection
  }
  display?: string
}

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

export interface IKpiMetric {
  value: number
  previousValue?: number
  changePercent?: number
  trend?: Trend
  formattedValue?: string
  periodLabel?: string
  comparisonLabel?: string
}

export interface ITimeSeriesPoint {
  timestamp: string
  value: number
  label?: string
  isHighlighted?: boolean
}

export interface ITimeSeries {
  metric: string
  groupBy: GroupBy
  totalValue: number
  changePercent?: number
  points: ITimeSeriesPoint[]
}

export interface IProportionSegment {
  key: string
  label: string
  value: number
  percentage: number
  color?: string
}

export interface IProportions {
  total: number
  formattedTotal?: string
  segments: IProportionSegment[]
}

// ============================================
// QUERY PARAMS
// ============================================

export interface IRankedListParams {
  dataset: Dataset
  period: IPeriodInput
  sortBy?: SortBy
  sortDirection?: SortDirection
  limit?: number
  branchId?: number
}

export interface IKpiMetricParams {
  type: KpiType
  period: IPeriodInput
  branchId?: number
}

export interface ITimeSeriesParams {
  metric: KpiType
  period: IPeriodInput
  groupBy?: GroupBy
  branchId?: number
}

export interface IProportionsParams {
  dimension: string
  period: IPeriodInput
  branchId?: number
}
