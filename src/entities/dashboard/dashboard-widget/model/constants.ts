import type {
  DashboardConfig,
  WidgetDimensions,
  WidgetSize,
  WidgetVisualization,
} from './types'

// Grid configuration
export const GRID_COLS = 4
export const GRID_ROW_HEIGHT = 140
export const GRID_MARGIN: [number, number] = [16, 16]

// Size mappings
export const WIDGET_SIZE_MAP: Record<WidgetSize, WidgetDimensions> = {
  '1x1': { w: 1, h: 1, minW: 1, minH: 1 },
  '2x1': { w: 2, h: 1, minW: 1, minH: 1, maxW: 4 },
  '1x2': { w: 1, h: 2, minW: 1, minH: 1, maxH: 4 },
  '2x2': { w: 2, h: 2, minW: 1, minH: 1, maxW: 4, maxH: 4 },
}

// Visualization labels
export const VISUALIZATION_LABELS: Record<WidgetVisualization, string> = {
  number: 'Число с трендом',
  'line-chart': 'Линейный график',
  'bar-chart': 'Столбчатая диаграмма',
  'pie-chart': 'Круговая диаграмма',
  list: 'Список',
  text: 'Текст',
}

// Visualization icons
export const VISUALIZATION_ICONS: Record<WidgetVisualization, string> = {
  number: 'IconHash',
  'line-chart': 'IconChartLine',
  'bar-chart': 'IconChartBar',
  'pie-chart': 'IconChartPie',
  list: 'IconList',
  text: 'IconTextCaption',
}

// Recommended sizes for each visualization
export const VISUALIZATION_RECOMMENDED_SIZES: Record<
  WidgetVisualization,
  WidgetSize[]
> = {
  number: ['1x1'],
  'line-chart': ['2x1', '2x2'],
  'bar-chart': ['2x1', '2x2'],
  'pie-chart': ['1x1', '2x2'],
  list: ['1x2', '2x2'],
  text: ['1x1', '2x1'],
}

// Data source labels
export const DATA_SOURCE_LABELS: Record<string, string> = {
  analytics: 'Аналитика',
  orders: 'Заказы',
  products: 'Продукты',
  custom: 'Произвольный',
}

// Data field labels by source
export const DATA_FIELD_LABELS: Record<string, Record<string, string>> = {
  analytics: {
    revenue: 'Выручка',
    orders: 'Количество заказов',
    avgCheck: 'Средний чек',
    topProduct: 'Топ продукт',
    revenueChart: 'График выручки',
    ordersChart: 'График заказов',
    recentOrders: 'Последние заказы',
    topProducts: 'Топ продукты',
  },
  orders: {
    recentOrders: 'Последние заказы',
    orderCount: 'Количество заказов',
    pendingOrders: 'Ожидающие заказы',
  },
  products: {
    topSelling: 'Самые продаваемые',
    lowStock: 'Мало на складе',
    productCount: 'Количество товаров',
  },
}

// Time interval labels
export const TIME_INTERVAL_LABELS: Record<string, string> = {
  today: 'Сегодня',
  yesterday: 'Вчера',
  week: 'Неделя',
  month: 'Месяц',
  quarter: 'Квартал',
  year: 'Год',
  custom: 'Произвольный',
}

// Default dashboard configuration
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  version: 1,
  layout: [],
  widgets: {},
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Animation settings
export const COUNTER_ANIMATION_DURATION = 500
export const FADE_IN_DURATION = 300

// Storage key
export const DASHBOARD_STORAGE_KEY = 'horyco-dashboard-config'
