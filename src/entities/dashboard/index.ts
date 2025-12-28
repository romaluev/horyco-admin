/**
 * Dashboard Entity
 * Public API for dashboard configuration and data
 */

// Types
export type {
  IDashboardConfig,
  IDashboardConfigInput,
  IDashboardWidget,
  IKpiSlot,
  WidgetType,
  IKpiMetricValue,
  ITimeSeriesData,
  ITimeSeriesPoint,
  IRankedItem,
  IProportionsData,
  IProportionSegment,
  IHeatmapData,
  IHeatmapCell,
  IGoalsSummary,
  IGoalProgress,
  IAlertSummary,
  IAlert,
  IEntitlements,
  IPeriodInput,
  IKpiMetricsParams,
  ITimeSeriesParams,
  IRankedListParams,
  IProportionsParams,
  IHeatmapParams,
} from './model/types'

// Hooks
export {
  useDashboardConfig,
  useSaveDashboardConfig,
  useEntitlements,
  useCanCustomizeDashboard,
  useKpiMetrics,
  useTimeSeries,
  useRankedList,
  useProportions,
  useHeatmap,
  useGoalsSummary,
  useAlertSummary,
  getDefaultDashboardConfig,
} from './model/hooks'

// Query keys
export { dashboardKeys } from './model/query-keys'
