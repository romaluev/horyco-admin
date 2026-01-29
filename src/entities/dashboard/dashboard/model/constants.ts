/**
 * Dashboard Constants
 * Single source of truth for KPI and Widget configurations
 */

import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconReceipt,
  IconUsers,
  IconUserPlus,
  IconRefresh,
  IconCash,
  IconReceiptRefund,
  IconX,
  IconChartBar,
  IconPercentage,
  IconActivity,
} from '@tabler/icons-react'

import { KpiType } from '@/shared/api/graphql'

import type { WidgetType, ChartType } from './types'

// ============================================
// CHART TYPE OPTIONS
// ============================================

// ============================================
// KPI CONFIGURATION
// ============================================

export interface IKpiConfig {
  labelKey: string
  icon: typeof IconCurrencyDollar
  color: string
  bgColor: string
}

export const KPI_CONFIG: Record<KpiType, IKpiConfig> = {
  [KpiType.REVENUE]: {
    labelKey: 'dashboard.kpiLabels.revenue',
    icon: IconCurrencyDollar,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  [KpiType.ORDERS]: {
    labelKey: 'dashboard.kpiLabels.orders',
    icon: IconShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  [KpiType.AVG_CHECK]: {
    labelKey: 'dashboard.kpiLabels.avgCheck',
    icon: IconReceipt,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  [KpiType.CUSTOMERS]: {
    labelKey: 'dashboard.kpiLabels.customers',
    icon: IconUsers,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  [KpiType.NEW_CUSTOMERS]: {
    labelKey: 'dashboard.kpiLabels.newCustomers',
    icon: IconUserPlus,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
  [KpiType.RETURNING_CUSTOMERS]: {
    labelKey: 'dashboard.kpiLabels.returningCustomers',
    icon: IconRefresh,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  [KpiType.TIPS]: {
    labelKey: 'dashboard.kpiLabels.tips',
    icon: IconCash,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  [KpiType.REFUNDS]: {
    labelKey: 'dashboard.kpiLabels.refunds',
    icon: IconReceiptRefund,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  [KpiType.CANCELLATIONS]: {
    labelKey: 'dashboard.kpiLabels.cancellations',
    icon: IconX,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  [KpiType.MARGIN]: {
    labelKey: 'dashboard.kpiLabels.margin',
    icon: IconChartBar,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100 dark:bg-lime-900/30',
  },
  [KpiType.RETENTION_RATE]: {
    labelKey: 'dashboard.kpiLabels.retentionRate',
    icon: IconPercentage,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  [KpiType.STAFF_PRODUCTIVITY]: {
    labelKey: 'dashboard.kpiLabels.staffProductivity',
    icon: IconActivity,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
  },
}

// Translation key map for charts/components that only need keys
export const KPI_LABEL_KEYS: Record<KpiType, string> = Object.fromEntries(
  Object.entries(KPI_CONFIG).map(([key, config]) => [key, config.labelKey])
) as Record<KpiType, string>

// Currency metrics for formatting
export const CURRENCY_METRICS: KpiType[] = [
  KpiType.REVENUE,
  KpiType.AVG_CHECK,
  KpiType.TIPS,
  KpiType.REFUNDS,
  KpiType.MARGIN,
]

// ============================================
// WIDGET CONFIGURATION
// ============================================

export type WidgetPreviewType =
  | 'area'
  | 'bar'
  | 'line'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'list'
  | 'funnel'
  | 'heatmap'

export type WidgetCategory = 'charts' | 'analytics' | 'data' | 'insights'

export interface IWidgetConfig {
  titleKey: string
  descriptionKey: string
  category: WidgetCategory
  preview: WidgetPreviewType
  size?: 'normal' | 'wide' | 'tall'
}

export const WIDGET_CONFIG: Record<WidgetType, IWidgetConfig> = {
  // Charts
  REVENUE_OVERVIEW: {
    titleKey: 'dashboard.widgetTitles.revenueOverview',
    descriptionKey: 'dashboard.widgetDescriptions.revenueOverview',
    category: 'charts',
    preview: 'area',
    size: 'wide',
  },
  TRANSACTIONS_SUMMARY: {
    titleKey: 'dashboard.widgetTitles.transactionsSummary',
    descriptionKey: 'dashboard.widgetDescriptions.transactionsSummary',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  INCOME_EXPENSE: {
    titleKey: 'dashboard.widgetTitles.incomeExpense',
    descriptionKey: 'dashboard.widgetDescriptions.incomeExpense',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  DAILY_COMPARISON: {
    titleKey: 'dashboard.widgetTitles.dailyComparison',
    descriptionKey: 'dashboard.widgetDescriptions.dailyComparison',
    category: 'charts',
    preview: 'line',
  },
  CUSTOMER_RATINGS: {
    titleKey: 'dashboard.widgetTitles.customerRatings',
    descriptionKey: 'dashboard.widgetDescriptions.customerRatings',
    category: 'charts',
    preview: 'line',
  },
  ORDERS_CHART: {
    titleKey: 'dashboard.widgetTitles.ordersChart',
    descriptionKey: 'dashboard.widgetDescriptions.ordersChart',
    category: 'charts',
    preview: 'area',
  },

  // Analytics
  PERFORMANCE_RADAR: {
    titleKey: 'dashboard.widgetTitles.performanceRadar',
    descriptionKey: 'dashboard.widgetDescriptions.performanceRadar',
    category: 'analytics',
    preview: 'radar',
  },
  CONVERSION_FUNNEL: {
    titleKey: 'dashboard.widgetTitles.conversionFunnel',
    descriptionKey: 'dashboard.widgetDescriptions.conversionFunnel',
    category: 'analytics',
    preview: 'funnel',
  },
  GOAL_RADIAL: {
    titleKey: 'dashboard.widgetTitles.goalRadial',
    descriptionKey: 'dashboard.widgetDescriptions.goalRadial',
    category: 'analytics',
    preview: 'donut',
  },
  HOURLY_BREAKDOWN: {
    titleKey: 'dashboard.widgetTitles.hourlyBreakdown',
    descriptionKey: 'dashboard.widgetDescriptions.hourlyBreakdown',
    category: 'analytics',
    preview: 'heatmap',
  },
  GOAL_PROGRESS: {
    titleKey: 'dashboard.widgetTitles.goalProgress',
    descriptionKey: 'dashboard.widgetDescriptions.goalProgress',
    category: 'analytics',
    preview: 'donut',
  },
  ALERTS: {
    titleKey: 'dashboard.widgetTitles.alerts',
    descriptionKey: 'dashboard.widgetDescriptions.alerts',
    category: 'analytics',
    preview: 'list',
  },

  // Data
  TOP_PRODUCTS: {
    titleKey: 'dashboard.widgetTitles.topProducts',
    descriptionKey: 'dashboard.widgetDescriptions.topProducts',
    category: 'data',
    preview: 'list',
  },
  PAYMENT_METHODS: {
    titleKey: 'dashboard.widgetTitles.paymentMethods',
    descriptionKey: 'dashboard.widgetDescriptions.paymentMethods',
    category: 'data',
    preview: 'pie',
  },
  CHANNEL_SPLIT: {
    titleKey: 'dashboard.widgetTitles.channelSplit',
    descriptionKey: 'dashboard.widgetDescriptions.channelSplit',
    category: 'data',
    preview: 'donut',
  },
  STAFF_RANKING: {
    titleKey: 'dashboard.widgetTitles.staffRanking',
    descriptionKey: 'dashboard.widgetDescriptions.staffRanking',
    category: 'data',
    preview: 'list',
  },
  ORDERS_BY_CATEGORY: {
    titleKey: 'dashboard.widgetTitles.ordersByCategory',
    descriptionKey: 'dashboard.widgetDescriptions.ordersByCategory',
    category: 'data',
    preview: 'donut',
  },
  VISITORS_TRAFFIC: {
    titleKey: 'dashboard.widgetTitles.visitorsTraffic',
    descriptionKey: 'dashboard.widgetDescriptions.visitorsTraffic',
    category: 'data',
    preview: 'bar',
  },

  // Insights
  ANOMALY_DETECTION: {
    titleKey: 'dashboard.widgetTitles.anomalyDetection',
    descriptionKey: 'dashboard.widgetDescriptions.anomalyDetection',
    category: 'insights',
    preview: 'bar',
  },
  SALES_METRICS: {
    titleKey: 'dashboard.widgetTitles.salesMetrics',
    descriptionKey: 'dashboard.widgetDescriptions.salesMetrics',
    category: 'insights',
    preview: 'donut',
    size: 'wide',
  },

  // Enhanced Widgets (placeholders)
  EARNINGS_REPORT: {
    titleKey: 'dashboard.widgetTitles.earningsReport',
    descriptionKey: 'dashboard.widgetDescriptions.earningsReport',
    category: 'insights',
    preview: 'bar',
  },
  GROWTH_GAUGE: {
    titleKey: 'dashboard.widgetTitles.growthGauge',
    descriptionKey: 'dashboard.widgetDescriptions.growthGauge',
    category: 'analytics',
    preview: 'donut',
  },
  COMBO_CHART: {
    titleKey: 'dashboard.widgetTitles.comboChart',
    descriptionKey: 'dashboard.widgetDescriptions.comboChart',
    category: 'charts',
    preview: 'area',
    size: 'wide',
  },
  CHANNEL_SALES_BREAKDOWN: {
    titleKey: 'dashboard.widgetTitles.channelSalesBreakdown',
    descriptionKey: 'dashboard.widgetDescriptions.channelSalesBreakdown',
    category: 'data',
    preview: 'bar',
  },
  PERFORMANCE_TABS: {
    titleKey: 'dashboard.widgetTitles.performanceTabs',
    descriptionKey: 'dashboard.widgetDescriptions.performanceTabs',
    category: 'analytics',
    preview: 'list',
  },
  SALES_PLAN_PROGRESS: {
    titleKey: 'dashboard.widgetTitles.salesPlanProgress',
    descriptionKey: 'dashboard.widgetDescriptions.salesPlanProgress',
    category: 'analytics',
    preview: 'donut',
  },
  YEAR_COMPARISON: {
    titleKey: 'dashboard.widgetTitles.yearComparison',
    descriptionKey: 'dashboard.widgetDescriptions.yearComparison',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  FINANCE_REPORT: {
    titleKey: 'dashboard.widgetTitles.financeReport',
    descriptionKey: 'dashboard.widgetDescriptions.financeReport',
    category: 'insights',
    preview: 'area',
    size: 'wide',
  },
  TOP_SERVICES_BARS: {
    titleKey: 'dashboard.widgetTitles.topServices',
    descriptionKey: 'dashboard.widgetDescriptions.topServices',
    category: 'data',
    preview: 'bar',
  },
  TOTAL_EARNING_DUAL: {
    titleKey: 'dashboard.widgetTitles.totalEarning',
    descriptionKey: 'dashboard.widgetDescriptions.totalEarning',
    category: 'charts',
    preview: 'area',
  },
  WEEKLY_OVERVIEW_COMBO: {
    titleKey: 'dashboard.widgetTitles.weeklyOverview',
    descriptionKey: 'dashboard.widgetDescriptions.weeklyOverview',
    category: 'charts',
    preview: 'bar',
  },

  // Legacy (backwards compatibility)
  RECENT_ORDERS: {
    titleKey: 'dashboard.widgetTitles.recentOrders',
    descriptionKey: 'dashboard.widgetDescriptions.recentOrders',
    category: 'data',
    preview: 'list',
  },
  CUSTOMER_SEGMENTS: {
    titleKey: 'dashboard.widgetTitles.customerSegments',
    descriptionKey: 'dashboard.widgetDescriptions.customerSegments',
    category: 'data',
    preview: 'pie',
  },
  BRANCH_COMPARISON: {
    titleKey: 'dashboard.widgetTitles.branchComparison',
    descriptionKey: 'dashboard.widgetDescriptions.branchComparison',
    category: 'analytics',
    preview: 'bar',
  },
}

// Category label keys for grouping
export const WIDGET_CATEGORY_LABEL_KEYS: Record<WidgetCategory, string> = {
  charts: 'dashboard.widgetCategories.charts',
  analytics: 'dashboard.widgetCategories.analytics',
  data: 'dashboard.widgetCategories.data',
  insights: 'dashboard.widgetCategories.insights',
}

// Helper to get widgets by category
export function getWidgetsByCategory(category: WidgetCategory): WidgetType[] {
  return (Object.entries(WIDGET_CONFIG) as [WidgetType, IWidgetConfig][])
    .filter(([, config]) => config.category === category)
    .map(([type]) => type)
}

export interface IChartTypeOption {
  value: ChartType
  labelKey: string
}

export const CHART_TYPE_OPTIONS: IChartTypeOption[] = [
  { value: 'area', labelKey: 'dashboard.chartTypes.area' },
  { value: 'bar', labelKey: 'dashboard.chartTypes.bar' },
  { value: 'line', labelKey: 'dashboard.chartTypes.line' },
  { value: 'radial', labelKey: 'dashboard.chartTypes.radial' },
  { value: 'radar', labelKey: 'dashboard.chartTypes.radar' },
]

// ============================================
// DEMO DATA (for previews only)
// ============================================

export const DEMO_CHART_DATA = [
  { value: 400 },
  { value: 300 },
  { value: 600 },
  { value: 800 },
  { value: 500 },
  { value: 900 },
  { value: 700 },
  { value: 850 },
]

export const DEMO_RADAR_DATA = [
  { subject: 'A', value: 120 },
  { subject: 'B', value: 98 },
  { subject: 'C', value: 86 },
  { subject: 'D', value: 99 },
  { subject: 'E', value: 85 },
]

export const DEMO_PIE_DATA = [
  { value: 400, color: '#fe4a49' },
  { value: 300, color: '#3b82f6' },
  { value: 200, color: '#22c55e' },
]

// Primary brand color for charts
export const PRIMARY_COLOR = '#fe4a49'
