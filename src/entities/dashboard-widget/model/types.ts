// Widget sizes for 4-column grid
export type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2'

export interface WidgetDimensions {
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
}

// Widget visualization types
export type WidgetVisualization =
  | 'number'
  | 'line-chart'
  | 'bar-chart'
  | 'pie-chart'
  | 'list'
  | 'text'

// Data source types
export type WidgetDataSource = 'analytics' | 'orders' | 'products' | 'custom'

// Data fields by source
export interface AnalyticsDataField {
  source: 'analytics'
  field:
    | 'revenue'
    | 'orders'
    | 'avgCheck'
    | 'topProduct'
    | 'revenueChart'
    | 'ordersChart'
    | 'recentOrders'
    | 'topProducts'
}

export interface OrdersDataField {
  source: 'orders'
  field: 'recentOrders' | 'orderCount' | 'pendingOrders'
}

export interface ProductsDataField {
  source: 'products'
  field: 'topSelling' | 'lowStock' | 'productCount'
}

export interface CustomDataField {
  source: 'custom'
  field: string
  endpoint?: string
}

export type WidgetDataField =
  | AnalyticsDataField
  | OrdersDataField
  | ProductsDataField
  | CustomDataField

// Time intervals
export type WidgetTimeInterval =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom'

export interface WidgetTimeRange {
  interval: WidgetTimeInterval
  customStart?: string
  customEnd?: string
}

// Main widget configuration
export interface WidgetConfig {
  id: string
  name: string
  visualization: WidgetVisualization
  size: WidgetSize
  dataField: WidgetDataField
  timeRange: WidgetTimeRange
  showTrend?: boolean
  showAnimation?: boolean
  chartColor?: string
  limit?: number
  refreshInterval?: number
}

// Layout item for react-grid-layout
export interface WidgetLayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
}

// Complete dashboard configuration
export interface DashboardConfig {
  version: number
  layout: WidgetLayoutItem[]
  widgets: Record<string, WidgetConfig>
  createdAt: string
  updatedAt: string
}

// Widget preset for quick adding
export interface WidgetPreset {
  id: string
  name: string
  description: string
  icon: string
  defaultConfig: Omit<WidgetConfig, 'id' | 'name'>
}

// Widget data response (generic)
export interface WidgetData {
  value?: number
  previousValue?: number
  change?: number
  changePercent?: number
  chartData?: { label: string; value: number }[]
  listData?: Record<string, unknown>[]
  text?: string
}
