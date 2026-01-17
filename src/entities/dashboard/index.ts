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
  ChartType,
  ChartVariant,
  IMainChartConfig,
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

// Constants
export {
  KPI_CONFIG,
  KPI_LABELS,
  CURRENCY_METRICS,
  WIDGET_CONFIG,
  WIDGET_CATEGORY_LABELS,
  CHART_TYPE_OPTIONS,
  DEMO_CHART_DATA,
  DEMO_RADAR_DATA,
  DEMO_PIE_DATA,
  PRIMARY_COLOR,
  getWidgetsByCategory,
} from './model/constants'

export type {
  IKpiConfig,
  IWidgetConfig,
  WidgetPreviewType,
  WidgetCategory,
  IChartTypeOption,
} from './model/constants'
