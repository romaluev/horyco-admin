/**
 * Analytics API Client
 * Based on docs: 23-analytics-reporting.md, 29-analytics-integration-guide.md (updated 2025-12-28)
 *
 * All analytics endpoints use GraphQL
 */

import { executeQuery, type IPeriodInput } from '@/shared/api/graphql'

import {
  SALES_OVERVIEW_QUERY,
  PRODUCT_ANALYTICS_QUERY,
  CATEGORY_ANALYTICS_QUERY,
  PAYMENT_METHODS_ANALYTICS_QUERY,
  STAFF_ANALYTICS_QUERY,
  CUSTOMER_OVERVIEW_QUERY,
  RFM_ANALYSIS_QUERY,
  COHORT_ANALYSIS_QUERY,
  HEATMAP_ANALYTICS_QUERY,
  CHANNELS_ANALYTICS_QUERY,
  BRANCH_COMPARISON_QUERY,
  BRANCH_BENCHMARK_QUERY,
  PROFIT_LOSS_QUERY,
  MARGIN_ANALYSIS_QUERY,
  CASH_FLOW_QUERY,
  ALERT_SUMMARY_ANALYTICS_QUERY,
  ALERTS_QUERY,
  EXPORT_REPORT_QUERY,
} from './queries'

import type {
  ISalesOverviewData,
  IProductAnalyticsData,
  ICategoryAnalyticsData,
  IPaymentMethodsAnalyticsData,
  IStaffAnalyticsData,
  ICustomerOverviewData,
  IRfmAnalysisData,
  ICohortAnalysisData,
  IHeatmapData,
  IChannelsAnalyticsData,
  IBranchComparisonData,
  IBranchBenchmarkData,
  IProfitLossData,
  IMarginAnalysisData,
  ICashFlowData,
  IAlertSummaryData,
  IAlertsData,
  IExportReportResult,
} from '../model/types'

// ============================================
// COMMON PARAMS
// ============================================

interface IBaseParams {
  period: IPeriodInput
  branchId?: number
}

// ============================================
// SALES OVERVIEW (BASIC)
// ============================================

export async function getSalesOverview(params: IBaseParams): Promise<ISalesOverviewData> {
  const result = await executeQuery<{ salesOverview: ISalesOverviewData }>(
    SALES_OVERVIEW_QUERY,
    params
  )
  return result.salesOverview
}

// ============================================
// PRODUCT ANALYTICS (BASIC)
// Per doc 23: Returns typed response
// ============================================

interface IProductAnalyticsParams extends IBaseParams {
  limit?: number
  offset?: number
}

export async function getProductAnalytics(
  params: IProductAnalyticsParams
): Promise<IProductAnalyticsData> {
  const result = await executeQuery<{ productAnalytics: IProductAnalyticsData }>(
    PRODUCT_ANALYTICS_QUERY,
    params
  )
  return result.productAnalytics
}

// ============================================
// CATEGORY ANALYTICS (BASIC)
// Per doc 23: Returns typed response
// ============================================

export async function getCategoryAnalytics(
  params: IBaseParams
): Promise<ICategoryAnalyticsData> {
  const result = await executeQuery<{ categoryAnalytics: ICategoryAnalyticsData }>(
    CATEGORY_ANALYTICS_QUERY,
    params
  )
  return result.categoryAnalytics
}

// ============================================
// PAYMENT METHODS ANALYTICS (BASIC)
// Per doc 23: Returns typed response
// ============================================

export async function getPaymentMethodsAnalytics(
  params: IBaseParams
): Promise<IPaymentMethodsAnalyticsData> {
  const result = await executeQuery<{ paymentMethodsAnalytics: IPaymentMethodsAnalyticsData }>(
    PAYMENT_METHODS_ANALYTICS_QUERY,
    params
  )
  return result.paymentMethodsAnalytics
}

// ============================================
// STAFF ANALYTICS (PRO)
// Per doc 23: Returns typed response
// ============================================

export async function getStaffAnalytics(params: IBaseParams): Promise<IStaffAnalyticsData> {
  const result = await executeQuery<{ staffAnalytics: IStaffAnalyticsData }>(
    STAFF_ANALYTICS_QUERY,
    params
  )
  return result.staffAnalytics
}

// ============================================
// CUSTOMER ANALYTICS (PRO)
// Per doc 23: Returns GraphQL JSON
// ============================================

export async function getCustomerOverview(
  params: IBaseParams
): Promise<ICustomerOverviewData> {
  const result = await executeQuery<{ customerOverview: ICustomerOverviewData }>(
    CUSTOMER_OVERVIEW_QUERY,
    params
  )
  return result.customerOverview
}

interface IRfmParams {
  lookbackDays?: number
  branchId?: number
}

export async function getRfmAnalysis(params: IRfmParams): Promise<IRfmAnalysisData> {
  const result = await executeQuery<{ rfmAnalysis: IRfmAnalysisData }>(
    RFM_ANALYSIS_QUERY,
    params
  )
  return result.rfmAnalysis
}

interface ICohortParams {
  months?: number
  branchId?: number
}

export async function getCohortAnalysis(params: ICohortParams): Promise<ICohortAnalysisData> {
  const result = await executeQuery<{ cohortAnalysis: ICohortAnalysisData }>(
    COHORT_ANALYSIS_QUERY,
    params
  )
  return result.cohortAnalysis
}

// ============================================
// HEATMAP (PRO)
// Per doc 23: Returns typed response
// metric is String ("orders" | "revenue"), not KpiType
// ============================================

interface IHeatmapParams extends IBaseParams {
  metric?: 'orders' | 'revenue'
}

export async function getHeatmap(params: IHeatmapParams): Promise<IHeatmapData> {
  const result = await executeQuery<{ heatmap: IHeatmapData }>(
    HEATMAP_ANALYTICS_QUERY,
    params
  )
  return result.heatmap
}

// ============================================
// CHANNELS ANALYTICS (PRO)
// Per doc 23: Returns typed response
// ============================================

export async function getChannelsAnalytics(
  params: IBaseParams
): Promise<IChannelsAnalyticsData> {
  const result = await executeQuery<{ channelsAnalytics: IChannelsAnalyticsData }>(
    CHANNELS_ANALYTICS_QUERY,
    params
  )
  return result.channelsAnalytics
}

// ============================================
// BRANCH ANALYTICS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

interface IBranchComparisonParams {
  period: IPeriodInput
  sortBy?: 'revenue' | 'orders' | 'avgCheck'
}

export async function getBranchComparison(
  params: IBranchComparisonParams
): Promise<IBranchComparisonData> {
  const result = await executeQuery<{ branchComparison: IBranchComparisonData }>(
    BRANCH_COMPARISON_QUERY,
    params
  )
  return result.branchComparison
}

interface IBranchBenchmarkParams {
  period: IPeriodInput
}

export async function getBranchBenchmark(
  params: IBranchBenchmarkParams
): Promise<IBranchBenchmarkData> {
  const result = await executeQuery<{ branchBenchmark: IBranchBenchmarkData }>(
    BRANCH_BENCHMARK_QUERY,
    params
  )
  return result.branchBenchmark
}

// ============================================
// FINANCIAL ANALYTICS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// ============================================

interface IProfitLossParams extends IBaseParams {
  comparePreviousPeriod?: boolean
}

export async function getProfitLoss(params: IProfitLossParams): Promise<IProfitLossData> {
  const result = await executeQuery<{ profitLoss: IProfitLossData }>(
    PROFIT_LOSS_QUERY,
    params
  )
  return result.profitLoss
}

interface IMarginAnalysisParams extends IBaseParams {
  categoryIds?: number[]
  productIds?: number[]
  marginThreshold?: number
}

export async function getMarginAnalysis(
  params: IMarginAnalysisParams
): Promise<IMarginAnalysisData> {
  const result = await executeQuery<{ marginAnalysis: IMarginAnalysisData }>(
    MARGIN_ANALYSIS_QUERY,
    params
  )
  return result.marginAnalysis
}

export async function getCashFlow(params: IBaseParams): Promise<ICashFlowData> {
  const result = await executeQuery<{ cashFlow: ICashFlowData }>(
    CASH_FLOW_QUERY,
    params
  )
  return result.cashFlow
}

// ============================================
// ALERTS (ULTRA)
// Per doc 23: Returns GraphQL JSON
// NOTE: alertSummary has NO status argument per doc
// ============================================

interface IAlertSummaryParams {
  branchId?: number
}

export async function getAlertSummary(
  params: IAlertSummaryParams
): Promise<IAlertSummaryData> {
  const result = await executeQuery<{ alertSummary: IAlertSummaryData }>(
    ALERT_SUMMARY_ANALYTICS_QUERY,
    params
  )
  return result.alertSummary
}

interface IAlertsParams {
  severity?: 'CRITICAL' | 'WARNING' | 'INFO'
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  type?: string
  branchId?: number
}

export async function getAlerts(params: IAlertsParams): Promise<IAlertsData> {
  const result = await executeQuery<{ alerts: IAlertsData }>(
    ALERTS_QUERY,
    params
  )
  return result.alerts
}

// ============================================
// EXPORT
// ============================================

interface IExportReportParams {
  reportType: string
  format: 'CSV' | 'XLSX' | 'PDF'
  startDate: string
  endDate: string
  columns?: string[]
  branchId?: number
}

export async function exportReport(
  params: IExportReportParams
): Promise<IExportReportResult> {
  const result = await executeQuery<{ exportReport: IExportReportResult }>(
    EXPORT_REPORT_QUERY,
    params
  )
  return result.exportReport
}

// ============================================
// NOTE: FORECAST IS NOT IMPLEMENTED
// Per doc 29-analytics-integration-guide.md:
// "forecast - Use cashFlow.forecast instead for projections"
// ============================================
