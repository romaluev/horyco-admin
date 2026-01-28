/**
 * Dashboard Query Keys
 * Centralized query key factory for React Query
 */

import type {
  IKpiMetricsParams,
  ITimeSeriesParams,
  IRankedListParams,
  IProportionsParams,
  IHeatmapParams,
} from './types'

export const dashboardKeys = {
  all: ['dashboard'] as const,

  // Dashboard configuration
  config: () => [...dashboardKeys.all, 'config'] as const,

  // User entitlements
  entitlements: () => [...dashboardKeys.all, 'entitlements'] as const,

  // KPI metrics
  kpiMetrics: (params: IKpiMetricsParams) =>
    [...dashboardKeys.all, 'kpi', params] as const,

  // Time series
  timeSeries: (params: ITimeSeriesParams) =>
    [...dashboardKeys.all, 'timeSeries', params] as const,

  // Ranked lists (products, staff)
  rankedList: (params: IRankedListParams) =>
    [...dashboardKeys.all, 'rankedList', params] as const,

  // Proportions (payment methods, channels)
  proportions: (params: IProportionsParams) =>
    [...dashboardKeys.all, 'proportions', params] as const,

  // Heatmap
  heatmap: (params: IHeatmapParams) =>
    [...dashboardKeys.all, 'heatmap', params] as const,

  // Goals
  goals: (branchId?: number) =>
    [...dashboardKeys.all, 'goals', branchId] as const,

  // Alerts
  alerts: (branchId?: number) =>
    [...dashboardKeys.all, 'alerts', branchId] as const,
}
