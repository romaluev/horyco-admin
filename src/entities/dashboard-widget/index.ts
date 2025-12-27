// Types
export type {
  DashboardConfig,
  WidgetConfig,
  WidgetData,
  WidgetDataField,
  WidgetDataSource,
  WidgetDimensions,
  WidgetLayoutItem,
  WidgetPreset,
  WidgetSize,
  WidgetTimeInterval,
  WidgetTimeRange,
  WidgetVisualization,
} from './model/types'

// Store
export { useDashboardWidgetStore } from './model/store'

// Constants
export {
  COUNTER_ANIMATION_DURATION,
  DASHBOARD_STORAGE_KEY,
  DATA_FIELD_LABELS,
  DATA_SOURCE_LABELS,
  DEFAULT_DASHBOARD_CONFIG,
  FADE_IN_DURATION,
  GRID_COLS,
  GRID_MARGIN,
  GRID_ROW_HEIGHT,
  TIME_INTERVAL_LABELS,
  VISUALIZATION_ICONS,
  VISUALIZATION_LABELS,
  VISUALIZATION_RECOMMENDED_SIZES,
  WIDGET_SIZE_MAP,
} from './model/constants'

// Presets
export {
  getPresetById,
  getPresetsByVisualization,
  WIDGET_PRESETS,
} from './model/presets'

// UI Components
export { WidgetCard } from './ui/widget-card'
export { WidgetSkeleton } from './ui/widget-skeleton'
