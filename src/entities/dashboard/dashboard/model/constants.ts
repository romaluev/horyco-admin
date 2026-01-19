/**
 * Dashboard Constants
 * Single source of truth for KPI and Widget configurations
 */

import {
  IconCurrencyDollar,
  IconShoppingCart,
  IconReceipt,
  IconUsers,
  IconUserPlus,
  IconRefresh,
  IconCash,
  IconReceiptRefund,
  IconX,
  IconChartBar,
  IconPercentage,
  IconActivity,
} from '@tabler/icons-react'

import { KpiType } from '@/shared/api/graphql'

import type { WidgetType } from './types'

// ============================================
// KPI CONFIGURATION
// ============================================

export interface IKpiConfig {
  label: string
  icon: typeof IconCurrencyDollar
  color: string
  bgColor: string
}

export const KPI_CONFIG: Record<KpiType, IKpiConfig> = {
  [KpiType.REVENUE]: {
    label: 'Выручка',
    icon: IconCurrencyDollar,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
  },
  [KpiType.ORDERS]: {
    label: 'Заказы',
    icon: IconShoppingCart,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
  },
  [KpiType.AVG_CHECK]: {
    label: 'Средний чек',
    icon: IconReceipt,
    color: 'text-violet-600',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
  },
  [KpiType.CUSTOMERS]: {
    label: 'Клиенты',
    icon: IconUsers,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
  },
  [KpiType.NEW_CUSTOMERS]: {
    label: 'Новые клиенты',
    icon: IconUserPlus,
    color: 'text-teal-600',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30',
  },
  [KpiType.RETURNING_CUSTOMERS]: {
    label: 'Постоянные',
    icon: IconRefresh,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
  },
  [KpiType.TIPS]: {
    label: 'Чаевые',
    icon: IconCash,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
  },
  [KpiType.REFUNDS]: {
    label: 'Возвраты',
    icon: IconReceiptRefund,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
  },
  [KpiType.CANCELLATIONS]: {
    label: 'Отмены',
    icon: IconX,
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
  },
  [KpiType.MARGIN]: {
    label: 'Маржа',
    icon: IconChartBar,
    color: 'text-lime-600',
    bgColor: 'bg-lime-100 dark:bg-lime-900/30',
  },
  [KpiType.RETENTION_RATE]: {
    label: 'Удержание',
    icon: IconPercentage,
    color: 'text-pink-600',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
  },
  [KpiType.STAFF_PRODUCTIVITY]: {
    label: 'Продуктивность',
    icon: IconActivity,
    color: 'text-fuchsia-600',
    bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30',
  },
}

// Simple label map for charts/components that only need labels
export const KPI_LABELS: Record<KpiType, string> = Object.fromEntries(
  Object.entries(KPI_CONFIG).map(([key, config]) => [key, config.label])
) as Record<KpiType, string>

// Currency metrics for formatting
export const CURRENCY_METRICS: KpiType[] = [
  KpiType.REVENUE,
  KpiType.AVG_CHECK,
  KpiType.TIPS,
  KpiType.REFUNDS,
  KpiType.MARGIN,
]

// ============================================
// WIDGET CONFIGURATION
// ============================================

export type WidgetPreviewType =
  | 'area'
  | 'bar'
  | 'line'
  | 'pie'
  | 'donut'
  | 'radar'
  | 'list'
  | 'funnel'
  | 'heatmap'

export type WidgetCategory = 'charts' | 'analytics' | 'data' | 'insights'

export interface IWidgetConfig {
  title: string
  description: string
  category: WidgetCategory
  preview: WidgetPreviewType
  size?: 'normal' | 'wide' | 'tall'
}

export const WIDGET_CONFIG: Record<WidgetType, IWidgetConfig> = {
  // Charts
  REVENUE_OVERVIEW: {
    title: 'Обзор дохода',
    description: 'График с суммарной статистикой',
    category: 'charts',
    preview: 'area',
    size: 'wide',
  },
  TRANSACTIONS_SUMMARY: {
    title: 'Сводка транзакций',
    description: 'Анализ транзакций',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  INCOME_EXPENSE: {
    title: 'Доходы и расходы',
    description: 'Финансовый отчет',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  DAILY_COMPARISON: {
    title: 'Дневное сравнение',
    description: 'Сравнение с предыдущим днем',
    category: 'charts',
    preview: 'line',
  },
  CUSTOMER_RATINGS: {
    title: 'Рейтинг клиентов',
    description: 'Звездный рейтинг с графиком',
    category: 'charts',
    preview: 'line',
  },
  ORDERS_CHART: {
    title: 'График заказов',
    description: 'Динамика заказов',
    category: 'charts',
    preview: 'area',
  },

  // Analytics
  PERFORMANCE_RADAR: {
    title: 'Эффективность',
    description: 'Radar-анализ показателей',
    category: 'analytics',
    preview: 'radar',
  },
  CONVERSION_FUNNEL: {
    title: 'Конверсионная воронка',
    description: 'Воронка продаж',
    category: 'analytics',
    preview: 'funnel',
  },
  GOAL_RADIAL: {
    title: 'Прогресс целей',
    description: 'Радиальный прогресс',
    category: 'analytics',
    preview: 'donut',
  },
  HOURLY_BREAKDOWN: {
    title: 'По часам',
    description: 'Тепловая карта',
    category: 'analytics',
    preview: 'heatmap',
  },
  GOAL_PROGRESS: {
    title: 'Цели',
    description: 'Прогресс по целям',
    category: 'analytics',
    preview: 'donut',
  },
  ALERTS: {
    title: 'Уведомления',
    description: 'Важные оповещения',
    category: 'analytics',
    preview: 'list',
  },

  // Data
  TOP_PRODUCTS: {
    title: 'Топ продукты',
    description: 'Лучшие товары по выручке',
    category: 'data',
    preview: 'list',
  },
  PAYMENT_METHODS: {
    title: 'Способы оплаты',
    description: 'Распределение по типам',
    category: 'data',
    preview: 'pie',
  },
  CHANNEL_SPLIT: {
    title: 'Каналы продаж',
    description: 'Доставка, зал, самовывоз',
    category: 'data',
    preview: 'donut',
  },
  STAFF_RANKING: {
    title: 'Рейтинг сотрудников',
    description: 'Топ сотрудников',
    category: 'data',
    preview: 'list',
  },
  ORDERS_BY_CATEGORY: {
    title: 'Заказы по категориям',
    description: 'Пончиковая диаграмма',
    category: 'data',
    preview: 'donut',
  },
  VISITORS_TRAFFIC: {
    title: 'Трафик посетителей',
    description: 'Разбивка по устройствам',
    category: 'data',
    preview: 'bar',
  },

  // Insights
  ANOMALY_DETECTION: {
    title: 'Обнаружение аномалий',
    description: 'Выявление отклонений',
    category: 'insights',
    preview: 'bar',
  },
  SALES_METRICS: {
    title: 'Метрики продаж',
    description: 'Комплексная аналитика',
    category: 'insights',
    preview: 'donut',
    size: 'wide',
  },

  // Enhanced Widgets (placeholders)
  EARNINGS_REPORT: {
    title: 'Отчет о доходах',
    description: 'Детальный отчет',
    category: 'insights',
    preview: 'bar',
  },
  GROWTH_GAUGE: {
    title: 'Индикатор роста',
    description: 'Показатель роста',
    category: 'analytics',
    preview: 'donut',
  },
  COMBO_CHART: {
    title: 'Комбо график',
    description: 'Смешанный график',
    category: 'charts',
    preview: 'area',
    size: 'wide',
  },
  CHANNEL_SALES_BREAKDOWN: {
    title: 'Продажи по каналам',
    description: 'Разбивка продаж',
    category: 'data',
    preview: 'bar',
  },
  PERFORMANCE_TABS: {
    title: 'Эффективность',
    description: 'Табличный вид',
    category: 'analytics',
    preview: 'list',
  },
  SALES_PLAN_PROGRESS: {
    title: 'Прогресс плана продаж',
    description: 'Выполнение плана',
    category: 'analytics',
    preview: 'donut',
  },
  YEAR_COMPARISON: {
    title: 'Сравнение по годам',
    description: 'Год к году',
    category: 'charts',
    preview: 'bar',
    size: 'wide',
  },
  FINANCE_REPORT: {
    title: 'Финансовый отчет',
    description: 'Полный отчет',
    category: 'insights',
    preview: 'area',
    size: 'wide',
  },
  TOP_SERVICES_BARS: {
    title: 'Топ услуги',
    description: 'Популярные услуги',
    category: 'data',
    preview: 'bar',
  },
  TOTAL_EARNING_DUAL: {
    title: 'Общий доход',
    description: 'Двойной график',
    category: 'charts',
    preview: 'area',
  },
  WEEKLY_OVERVIEW_COMBO: {
    title: 'Недельный обзор',
    description: 'Комбо за неделю',
    category: 'charts',
    preview: 'bar',
  },

  // Legacy (backwards compatibility)
  RECENT_ORDERS: {
    title: 'Последние заказы',
    description: 'Список заказов',
    category: 'data',
    preview: 'list',
  },
  CUSTOMER_SEGMENTS: {
    title: 'Сегменты клиентов',
    description: 'Группы клиентов',
    category: 'data',
    preview: 'pie',
  },
  BRANCH_COMPARISON: {
    title: 'Сравнение филиалов',
    description: 'По филиалам',
    category: 'analytics',
    preview: 'bar',
  },
}

// Category labels for grouping
export const WIDGET_CATEGORY_LABELS: Record<WidgetCategory, string> = {
  charts: 'Графики и диаграммы',
  analytics: 'Аналитика',
  data: 'Данные',
  insights: 'Аналитические выводы',
}

// Helper to get widgets by category
export function getWidgetsByCategory(category: WidgetCategory): WidgetType[] {
  return (Object.entries(WIDGET_CONFIG) as [WidgetType, IWidgetConfig][])
    .filter(([, config]) => config.category === category)
    .map(([type]) => type)
}

// ============================================
// CHART TYPE OPTIONS
// ============================================

import type { ChartType } from './types'

export interface IChartTypeOption {
  value: ChartType
  label: string
}

export const CHART_TYPE_OPTIONS: IChartTypeOption[] = [
  { value: 'area', label: 'Область' },
  { value: 'bar', label: 'Столбцы' },
  { value: 'line', label: 'Линия' },
  { value: 'radial', label: 'Радиальный' },
  { value: 'radar', label: 'Радар' },
]

// ============================================
// DEMO DATA (for previews only)
// ============================================

export const DEMO_CHART_DATA = [
  { value: 400 },
  { value: 300 },
  { value: 600 },
  { value: 800 },
  { value: 500 },
  { value: 900 },
  { value: 700 },
  { value: 850 },
]

export const DEMO_RADAR_DATA = [
  { subject: 'A', value: 120 },
  { subject: 'B', value: 98 },
  { subject: 'C', value: 86 },
  { subject: 'D', value: 99 },
  { subject: 'E', value: 85 },
]

export const DEMO_PIE_DATA = [
  { value: 400, color: '#fe4a49' },
  { value: 300, color: '#3b82f6' },
  { value: 200, color: '#22c55e' },
]

// Primary brand color for charts
export const PRIMARY_COLOR = '#fe4a49'
