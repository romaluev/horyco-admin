/**
 * Dashboard API Client
 * GraphQL operations for dashboard configuration and data
 */

import { executeQuery } from '@/shared/api/graphql'

import {
  DASHBOARD_CONFIG_QUERY,
  SAVE_DASHBOARD_CONFIG_MUTATION,
  ENTITLEMENTS_QUERY,
  KPI_METRICS_QUERY,
  TIME_SERIES_QUERY,
  RANKED_LIST_QUERY,
  PROPORTIONS_QUERY,
  HEATMAP_QUERY,
  GOALS_SUMMARY_QUERY,
  ALERT_SUMMARY_QUERY,
} from './queries'

import type {
  IDashboardConfig,
  IDashboardConfigInput,
  IEntitlements,
  IKpiMetricValue,
  IKpiMetricsParams,
  ITimeSeriesData,
  ITimeSeriesParams,
  IRankedItem,
  IRankedListParams,
  IProportionsData,
  IProportionsParams,
  IHeatmapData,
  IHeatmapParams,
  IGoalsSummary,
  IAlertSummary,
} from './types'

// ============================================
// DASHBOARD CONFIG API
// ============================================

export async function getDashboardConfig(): Promise<IDashboardConfig | null> {
  const result = await executeQuery<{ dashboardConfig: IDashboardConfig | null }>(
    DASHBOARD_CONFIG_QUERY
  )
  return result.dashboardConfig
}

export async function saveDashboardConfig(config: IDashboardConfigInput): Promise<boolean> {
  const result = await executeQuery<{ saveDashboardConfig: { success: boolean } }>(
    SAVE_DASHBOARD_CONFIG_MUTATION,
    { config }
  )
  return result.saveDashboardConfig.success
}

// ============================================
// ENTITLEMENTS API
// ============================================

export async function getEntitlements(): Promise<IEntitlements> {
  const result = await executeQuery<{ me: { entitlements: IEntitlements } }>(
    ENTITLEMENTS_QUERY
  )
  return result.me.entitlements
}

// ============================================
// KPI METRICS API
// ============================================

export async function getKpiMetrics(params: IKpiMetricsParams): Promise<IKpiMetricValue[]> {
  const result = await executeQuery<{ kpiMetrics: IKpiMetricValue[] }>(
    KPI_METRICS_QUERY,
    params
  )
  return result.kpiMetrics
}

// ============================================
// TIME SERIES API
// ============================================

export async function getTimeSeries(params: ITimeSeriesParams): Promise<ITimeSeriesData> {
  const result = await executeQuery<{ timeSeries: ITimeSeriesData }>(
    TIME_SERIES_QUERY,
    params
  )
  return result.timeSeries
}

// ============================================
// WIDGET DATA API
// ============================================

export async function getRankedList(params: IRankedListParams): Promise<IRankedItem[]> {
  const result = await executeQuery<{ rankedList: IRankedItem[] }>(
    RANKED_LIST_QUERY,
    params
  )
  return result.rankedList
}

export async function getProportions(params: IProportionsParams): Promise<IProportionsData> {
  const result = await executeQuery<{ proportions: IProportionsData }>(
    PROPORTIONS_QUERY,
    params
  )
  return result.proportions
}

export async function getHeatmap(params: IHeatmapParams): Promise<IHeatmapData> {
  const result = await executeQuery<{ heatmap: IHeatmapData }>(
    HEATMAP_QUERY,
    params
  )
  return result.heatmap
}

export async function getGoalsSummary(branchId?: number): Promise<IGoalsSummary> {
  const result = await executeQuery<{ goalsSummary: IGoalsSummary }>(
    GOALS_SUMMARY_QUERY,
    { branchId }
  )
  return result.goalsSummary
}

export async function getAlertSummary(branchId?: number): Promise<IAlertSummary> {
  const result = await executeQuery<{ alertSummary: IAlertSummary }>(
    ALERT_SUMMARY_QUERY,
    { branchId }
  )
  return result.alertSummary
}
