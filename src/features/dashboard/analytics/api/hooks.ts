/**
 * Analytics React Query Hooks
 * Based on docs: 23-analytics-reporting.md, 29-analytics-integration-guide.md (updated 2025-12-28)
 */

import { useQuery } from '@tanstack/react-query'

import type { IPeriodInput } from '@/shared/api/graphql'

import {
  getSalesOverview,
  getProductAnalytics,
  getCategoryAnalytics,
  getPaymentMethodsAnalytics,
  getStaffAnalytics,
  getCustomerOverview,
  getRfmAnalysis,
  getCohortAnalysis,
  getHeatmap,
  getChannelsAnalytics,
  getBranchComparison,
  getBranchBenchmark,
  getProfitLoss,
  getMarginAnalysis,
  getCashFlow,
  getAlertSummary,
  getAlerts,
} from './client'

// 5 minute stale time as per API caching spec
const FIVE_MINUTES = 5 * 60 * 1000
const TEN_MINUTES = 10 * 60 * 1000
const ONE_MINUTE = 60 * 1000

// ============================================
// QUERY KEYS
// ============================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  salesOverview: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'sales-overview', params] as const,
  productAnalytics: (params: { period: IPeriodInput; branchId?: number; limit?: number; offset?: number }) =>
    [...analyticsKeys.all, 'product-analytics', params] as const,
  categoryAnalytics: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'category-analytics', params] as const,
  paymentMethods: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'payment-methods', params] as const,
  staff: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'staff', params] as const,
  customerOverview: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'customer-overview', params] as const,
  rfmAnalysis: (params: { lookbackDays?: number; branchId?: number }) =>
    [...analyticsKeys.all, 'rfm', params] as const,
  cohortAnalysis: (params: { months?: number; branchId?: number }) =>
    [...analyticsKeys.all, 'cohort', params] as const,
  heatmap: (params: { period: IPeriodInput; metric?: 'orders' | 'revenue'; branchId?: number }) =>
    [...analyticsKeys.all, 'heatmap', params] as const,
  channels: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'channels', params] as const,
  branchComparison: (params: { period: IPeriodInput; sortBy?: string }) =>
    [...analyticsKeys.all, 'branch-comparison', params] as const,
  branchBenchmark: (params: { period: IPeriodInput }) =>
    [...analyticsKeys.all, 'branch-benchmark', params] as const,
  profitLoss: (params: { period: IPeriodInput; branchId?: number; comparePreviousPeriod?: boolean }) =>
    [...analyticsKeys.all, 'profit-loss', params] as const,
  marginAnalysis: (params: { period: IPeriodInput; branchId?: number; marginThreshold?: number }) =>
    [...analyticsKeys.all, 'margin-analysis', params] as const,
  cashFlow: (params: { period: IPeriodInput; branchId?: number }) =>
    [...analyticsKeys.all, 'cash-flow', params] as const,
  alerts: (params: { severity?: string; status?: string; type?: string; branchId?: number }) =>
    [...analyticsKeys.all, 'alerts', params] as const,
  alertSummary: (params: { branchId?: number }) =>
    [...analyticsKeys.all, 'alert-summary', params] as const,
}

// ============================================
// SALES OVERVIEW HOOK (BASIC)
// ============================================

interface IUseSalesOverviewParams {
  period: IPeriodInput
  branchId?: number
}

export function useSalesOverview(params: IUseSalesOverviewParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.salesOverview(params),
    queryFn: () => getSalesOverview(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// PRODUCT ANALYTICS HOOK (BASIC)
// ============================================

interface IUseProductAnalyticsParams {
  period: IPeriodInput
  branchId?: number
  limit?: number
  offset?: number
}

export function useProductAnalytics(params: IUseProductAnalyticsParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.productAnalytics(params),
    queryFn: () => getProductAnalytics(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// CATEGORY ANALYTICS HOOK (BASIC)
// ============================================

interface IUseCategoryAnalyticsParams {
  period: IPeriodInput
  branchId?: number
}

export function useCategoryAnalytics(params: IUseCategoryAnalyticsParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.categoryAnalytics(params),
    queryFn: () => getCategoryAnalytics(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// PAYMENT METHODS HOOK (BASIC)
// ============================================

interface IUsePaymentMethodsParams {
  period: IPeriodInput
  branchId?: number
}

export function usePaymentMethodsAnalytics(params: IUsePaymentMethodsParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.paymentMethods(params),
    queryFn: () => getPaymentMethodsAnalytics(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// STAFF ANALYTICS HOOK (PRO)
// ============================================

interface IUseStaffAnalyticsParams {
  period: IPeriodInput
  branchId?: number
}

export function useStaffAnalytics(params: IUseStaffAnalyticsParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.staff(params),
    queryFn: () => getStaffAnalytics(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// CUSTOMER ANALYTICS HOOKS (PRO)
// ============================================

interface IUseCustomerOverviewParams {
  period: IPeriodInput
  branchId?: number
}

export function useCustomerOverview(params: IUseCustomerOverviewParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.customerOverview(params),
    queryFn: () => getCustomerOverview(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

interface IUseRfmAnalysisParams {
  lookbackDays?: number
  branchId?: number
}

export function useRfmAnalysis(params: IUseRfmAnalysisParams = {}, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.rfmAnalysis(params),
    queryFn: () => getRfmAnalysis(params),
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

interface IUseCohortAnalysisParams {
  months?: number
  branchId?: number
}

export function useCohortAnalysis(params: IUseCohortAnalysisParams = {}, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.cohortAnalysis(params),
    queryFn: () => getCohortAnalysis(params),
    staleTime: TEN_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// HEATMAP HOOK (PRO)
// Per doc 23: metric is String ("orders" | "revenue"), not KpiType
// ============================================

interface IUseHeatmapParams {
  period: IPeriodInput
  metric?: 'orders' | 'revenue'
  branchId?: number
}

export function useHeatmap(params: IUseHeatmapParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.heatmap(params),
    queryFn: () => getHeatmap(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// CHANNELS ANALYTICS HOOK (PRO)
// ============================================

interface IUseChannelsAnalyticsParams {
  period: IPeriodInput
  branchId?: number
}

export function useChannelsAnalytics(params: IUseChannelsAnalyticsParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.channels(params),
    queryFn: () => getChannelsAnalytics(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// BRANCH ANALYTICS HOOKS (ULTRA)
// ============================================

interface IUseBranchComparisonParams {
  period: IPeriodInput
  sortBy?: 'revenue' | 'orders' | 'avgCheck'
}

export function useBranchComparison(params: IUseBranchComparisonParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.branchComparison(params),
    queryFn: () => getBranchComparison(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

interface IUseBranchBenchmarkParams {
  period: IPeriodInput
}

export function useBranchBenchmark(params: IUseBranchBenchmarkParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.branchBenchmark(params),
    queryFn: () => getBranchBenchmark(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// FINANCIAL ANALYTICS HOOKS (ULTRA)
// ============================================

interface IUseProfitLossParams {
  period: IPeriodInput
  branchId?: number
  comparePreviousPeriod?: boolean
}

export function useProfitLoss(params: IUseProfitLossParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.profitLoss(params),
    queryFn: () => getProfitLoss(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

interface IUseMarginAnalysisParams {
  period: IPeriodInput
  branchId?: number
  categoryIds?: number[]
  productIds?: number[]
  marginThreshold?: number
}

export function useMarginAnalysis(params: IUseMarginAnalysisParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.marginAnalysis(params),
    queryFn: () => getMarginAnalysis(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

interface IUseCashFlowParams {
  period: IPeriodInput
  branchId?: number
}

export function useCashFlow(params: IUseCashFlowParams, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.cashFlow(params),
    queryFn: () => getCashFlow(params),
    staleTime: FIVE_MINUTES,
    gcTime: TEN_MINUTES,
    enabled,
  })
}

// ============================================
// ALERTS HOOKS (ULTRA)
// Per doc 23: alertSummary has NO status argument
// Per doc 23: alertSummary TTL is 1 min (critical for monitoring)
// ============================================

interface IUseAlertsParams {
  severity?: 'CRITICAL' | 'WARNING' | 'INFO'
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  type?: string
  branchId?: number
}

export function useAlerts(params: IUseAlertsParams = {}, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.alerts(params),
    queryFn: () => getAlerts(params),
    staleTime: ONE_MINUTE,
    gcTime: FIVE_MINUTES,
    enabled,
  })
}

interface IUseAlertSummaryParams {
  branchId?: number
}

export function useAlertSummary(params: IUseAlertSummaryParams = {}, enabled = true) {
  return useQuery({
    queryKey: analyticsKeys.alertSummary(params),
    queryFn: () => getAlertSummary(params),
    staleTime: ONE_MINUTE,
    gcTime: FIVE_MINUTES,
    enabled,
  })
}

// ============================================
// NOTE: FORECAST IS NOT IMPLEMENTED
// Per doc 29-analytics-integration-guide.md:
// "forecast - Use cashFlow.forecast instead for projections"
// ============================================
