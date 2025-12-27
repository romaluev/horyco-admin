import type { WidgetPreset } from './types'

export const WIDGET_PRESETS: WidgetPreset[] = [
  // Number widgets
  {
    id: 'preset-revenue',
    name: 'Выручка',
    description: 'Общая выручка с трендом изменения',
    icon: 'IconCurrencyDollar',
    defaultConfig: {
      visualization: 'number',
      size: '1x1',
      dataField: { source: 'analytics', field: 'revenue' },
      timeRange: { interval: 'today' },
      showTrend: true,
      showAnimation: true,
    },
  },
  {
    id: 'preset-orders-count',
    name: 'Количество заказов',
    description: 'Общее количество заказов за период',
    icon: 'IconShoppingCart',
    defaultConfig: {
      visualization: 'number',
      size: '1x1',
      dataField: { source: 'analytics', field: 'orders' },
      timeRange: { interval: 'today' },
      showTrend: true,
      showAnimation: true,
    },
  },
  {
    id: 'preset-avg-check',
    name: 'Средний чек',
    description: 'Средняя сумма заказа',
    icon: 'IconReceipt',
    defaultConfig: {
      visualization: 'number',
      size: '1x1',
      dataField: { source: 'analytics', field: 'avgCheck' },
      timeRange: { interval: 'today' },
      showTrend: true,
      showAnimation: true,
    },
  },

  // Chart widgets
  {
    id: 'preset-revenue-chart',
    name: 'График выручки',
    description: 'Динамика выручки за период',
    icon: 'IconChartLine',
    defaultConfig: {
      visualization: 'line-chart',
      size: '2x1',
      dataField: { source: 'analytics', field: 'revenueChart' },
      timeRange: { interval: 'week' },
      chartColor: 'var(--primary)',
    },
  },
  {
    id: 'preset-orders-chart',
    name: 'График заказов',
    description: 'Динамика количества заказов',
    icon: 'IconChartBar',
    defaultConfig: {
      visualization: 'bar-chart',
      size: '2x1',
      dataField: { source: 'analytics', field: 'ordersChart' },
      timeRange: { interval: 'week' },
      chartColor: '#8b5cf6',
    },
  },
  {
    id: 'preset-top-products-pie',
    name: 'Топ продукты (круг)',
    description: 'Распределение продаж по продуктам',
    icon: 'IconChartPie',
    defaultConfig: {
      visualization: 'pie-chart',
      size: '2x2',
      dataField: { source: 'analytics', field: 'topProducts' },
      timeRange: { interval: 'week' },
      limit: 5,
    },
  },

  // List widgets
  {
    id: 'preset-recent-orders',
    name: 'Последние заказы',
    description: 'Список последних заказов',
    icon: 'IconListDetails',
    defaultConfig: {
      visualization: 'list',
      size: '2x2',
      dataField: { source: 'analytics', field: 'recentOrders' },
      timeRange: { interval: 'today' },
      limit: 10,
    },
  },
  {
    id: 'preset-top-products-list',
    name: 'Топ продукты',
    description: 'Список самых продаваемых товаров',
    icon: 'IconTrophy',
    defaultConfig: {
      visualization: 'list',
      size: '1x2',
      dataField: { source: 'analytics', field: 'topProducts' },
      timeRange: { interval: 'week' },
      limit: 5,
    },
  },

  // Text widget
  {
    id: 'preset-note',
    name: 'Заметка',
    description: 'Текстовая заметка или описание',
    icon: 'IconNote',
    defaultConfig: {
      visualization: 'text',
      size: '1x1',
      dataField: { source: 'custom', field: 'text' },
      timeRange: { interval: 'today' },
    },
  },
]

export function getPresetById(id: string): WidgetPreset | undefined {
  return WIDGET_PRESETS.find((preset) => preset.id === id)
}

export function getPresetsByVisualization(
  visualization: string
): WidgetPreset[] {
  return WIDGET_PRESETS.filter(
    (preset) => preset.defaultConfig.visualization === visualization
  )
}
