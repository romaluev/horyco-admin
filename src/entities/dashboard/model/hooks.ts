/**
 * Dashboard React Query Hooks
 * Based on documentation: /.claude/docs/24-analytics-dashboard.md
 */

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'

import { KpiType } from '@/shared/api/graphql'

import {
  getDashboardConfig,
  saveDashboardConfig,
  getEntitlements,
  getKpiMetrics,
  getTimeSeries,
  getRankedList,
  getProportions,
  getHeatmap,
  getGoalsSummary,
  getAlertSummary,
} from './api'
import { dashboardKeys } from './query-keys'

import type {
  IDashboardConfig,
  IDashboardConfigInput,
  IKpiMetricsParams,
  ITimeSeriesParams,
  IRankedListParams,
  IProportionsParams,
  IHeatmapParams,
} from './types'

const FIVE_MINUTES_MS = 5 * 60 * 1000

// ============================================
// DASHBOARD CONFIG HOOKS
// ============================================

/**
 * Hook to get dashboard configuration
 * Returns null if no custom config exists (use default)
 */
export function useDashboardConfig() {
  return useQuery({
    queryKey: dashboardKeys.config(),
    queryFn: getDashboardConfig,
    staleTime: FIVE_MINUTES_MS,
  })
}

/**
 * Hook to save dashboard configuration
 */
export function useSaveDashboardConfig() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (config: IDashboardConfigInput) => saveDashboardConfig(config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dashboardKeys.config() })
    },
  })
}

// ============================================
// ENTITLEMENTS HOOK
// ============================================

/**
 * Hook to get user entitlements
 * Use to check if user can customize dashboard
 */
export function useEntitlements() {
  return useQuery({
    queryKey: dashboardKeys.entitlements(),
    queryFn: getEntitlements,
    staleTime: FIVE_MINUTES_MS,
  })
}

/**
 * Hook to check if user can customize dashboard
 * Users with dashboard_custom OR analytics_full (ultra plan) can customize
 */
export function useCanCustomizeDashboard(): boolean {
  const { data } = useEntitlements()
  return data?.dashboard_custom || data?.analytics_full || false
}

// ============================================
// KPI METRICS HOOK
// ============================================

/**
 * Hook to get KPI metrics values
 */
export function useKpiMetrics(params: IKpiMetricsParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.kpiMetrics(params),
    queryFn: () => getKpiMetrics(params),
    staleTime: FIVE_MINUTES_MS,
    placeholderData: keepPreviousData,
    enabled,
  })
}

// ============================================
// TIME SERIES HOOK
// ============================================

/**
 * Hook to get time series data for chart
 */
export function useTimeSeries(params: ITimeSeriesParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.timeSeries(params),
    queryFn: () => getTimeSeries(params),
    staleTime: FIVE_MINUTES_MS,
    placeholderData: keepPreviousData,
    enabled,
  })
}

// ============================================
// WIDGET DATA HOOKS
// ============================================

/**
 * Hook to get ranked list (products, staff)
 */
export function useRankedList(params: IRankedListParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.rankedList(params),
    queryFn: () => getRankedList(params),
    staleTime: FIVE_MINUTES_MS,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to get proportions data (payment methods, channels)
 */
export function useProportions(params: IProportionsParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.proportions(params),
    queryFn: () => getProportions(params),
    staleTime: FIVE_MINUTES_MS,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to get heatmap data
 */
export function useHeatmap(params: IHeatmapParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.heatmap(params),
    queryFn: () => getHeatmap(params),
    staleTime: FIVE_MINUTES_MS,
    placeholderData: keepPreviousData,
    enabled,
  })
}

/**
 * Hook to get goals summary
 */
export function useGoalsSummary(branchId?: number, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.goals(branchId),
    queryFn: () => getGoalsSummary(branchId),
    staleTime: FIVE_MINUTES_MS,
    enabled,
  })
}

/**
 * Hook to get alert summary
 */
export function useAlertSummary(branchId?: number, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.alerts(branchId),
    queryFn: () => getAlertSummary(branchId),
    staleTime: FIVE_MINUTES_MS,
    enabled,
  })
}

// ============================================
// DEFAULT CONFIG
// ============================================

/**
 * Default dashboard configuration for BASIC plan users
 * or when no custom config exists
 */
export function getDefaultDashboardConfig(): IDashboardConfig {
  return {
    kpiSlots: [
      { position: 0, type: KpiType.REVENUE, visible: true },
      { position: 1, type: KpiType.ORDERS, visible: true },
      { position: 2, type: KpiType.AVG_CHECK, visible: true },
      { position: 3, type: KpiType.NEW_CUSTOMERS, visible: true },
    ],
    chartMetric: KpiType.REVENUE,
    chartGroupBy: null,
    widgets: [
      { id: 'w1', type: 'REVENUE_OVERVIEW', position: 0, config: null },
      { id: 'w2', type: 'TOP_PRODUCTS', position: 1, config: null },
      { id: 'w3', type: 'PAYMENT_METHODS', position: 2, config: null },
      { id: 'w4', type: 'CHANNEL_SPLIT', position: 3, config: null },
    ],
  }
}
