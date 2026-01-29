/**
 * Analytics Constants
 * Based on docs: 25-analytics-pages.md, 26-analytics-views.md
 *
 * Default views are hardcoded in frontend (NOT stored in database)
 * Available to all users, cannot be edited or deleted
 */

import { PeriodType, SortBy, SortDirection } from '@/shared/api/graphql'

import type {
  AnalyticsPageCode,
  IDefaultView,
  IPageAccessConfig,
} from './types'

// ============================================
// PAGE ACCESS CONFIGURATION
// ============================================

/**
 * Defines which entitlement tier is required for each analytics page
 * Per docs/25-analytics-pages.md - Page Access by Tier table
 */
export const PAGE_ACCESS_CONFIG: Record<AnalyticsPageCode, IPageAccessConfig> =
  {
    // BASIC tier pages (analytics_basic)
    sales: {
      pageCode: 'sales',
      requiredTier: 'analytics_basic',
      title: 'sales',
      titleEn: 'Sales Overview',
      description: 'Сводка по продажам и выручке',
      icon: 'chartBar',
      upgradeFeatures: [],
    },
    products: {
      pageCode: 'products',
      requiredTier: 'analytics_basic',
      title: 'products',
      titleEn: 'Products',
      description: 'Анализ продаж по продуктам',
      icon: 'package',
      upgradeFeatures: [],
    },
    categories: {
      pageCode: 'categories',
      requiredTier: 'analytics_basic',
      title: 'categories',
      titleEn: 'Categories',
      description: 'Анализ продаж по категориям',
      icon: 'category',
      upgradeFeatures: [],
    },
    payments: {
      pageCode: 'payments',
      requiredTier: 'analytics_basic',
      title: 'payments',
      titleEn: 'Payments',
      description: 'Анализ по способам оплаты',
      icon: 'billing',
      upgradeFeatures: [],
    },

    // PRO tier pages (analytics_pro)
    staff: {
      pageCode: 'staff',
      requiredTier: 'analytics_pro',
      title: 'staff',
      titleEn: 'Staff',
      description: 'Анализ эффективности персонала',
      icon: 'users',
      upgradeFeatures: [
        'Отслеживание производительности сотрудников',
        'Аналитика клиентов',
        'Тепловая карта',
        'И многое другое...',
      ],
    },
    customers: {
      pageCode: 'customers',
      requiredTier: 'analytics_pro',
      title: 'customers',
      titleEn: 'Customers',
      description: 'Анализ клиентской базы',
      icon: 'user',
      upgradeFeatures: [
        'RFM-сегментация',
        'Когортный анализ',
        'Анализ жизненной ценности клиента',
      ],
    },
    heatmap: {
      pageCode: 'heatmap',
      requiredTier: 'analytics_pro',
      title: 'heatmap',
      titleEn: 'Heatmap',
      description: 'Анализ нагрузки по часам и дням',
      icon: 'layoutGrid',
      upgradeFeatures: ['Визуализация пиковых часов', 'Оптимизация расписания'],
    },
    channels: {
      pageCode: 'channels',
      requiredTier: 'analytics_pro',
      title: 'channels',
      titleEn: 'Channels',
      description: 'Анализ по каналам продаж',
      icon: 'arrowsExchange',
      upgradeFeatures: ['Сравнение каналов', 'Динамика по каналам'],
    },

    // ULTRA tier pages (analytics_full)
    branches: {
      pageCode: 'branches',
      requiredTier: 'analytics_full',
      title: 'branches',
      titleEn: 'Branches',
      description: 'Сравнение и бенчмаркинг филиалов',
      icon: 'hierarchy',
      upgradeFeatures: [
        'Сравнение филиалов',
        'Бенчмаркинг',
        'Тренды по филиалам',
      ],
    },
    financial: {
      pageCode: 'financial',
      requiredTier: 'analytics_full',
      title: 'financial',
      titleEn: 'Financial',
      description: 'Финансовая аналитика и отчетность',
      icon: 'billing',
      upgradeFeatures: [
        'Отчет о прибылях и убытках',
        'Анализ маржинальности',
        'Движение денежных средств',
      ],
    },
    forecasting: {
      pageCode: 'forecasting',
      requiredTier: 'analytics_full',
      title: 'forecasting',
      titleEn: 'Forecasting',
      description: 'Прогноз продаж и спроса',
      icon: 'chartPie',
      upgradeFeatures: [
        'Прогноз выручки',
        'Прогноз заказов',
        'Сезонные тренды',
      ],
    },
    alerts: {
      pageCode: 'alerts',
      requiredTier: 'analytics_full',
      title: 'alerts',
      titleEn: 'Alerts',
      description: 'Уведомления о важных событиях',
      icon: 'warning',
      upgradeFeatures: [
        'Автоматические оповещения',
        'Обнаружение аномалий',
        'Пороговые значения',
      ],
    },
  }

/**
 * List of pages by tier for easy filtering
 */
export const BASIC_TIER_PAGES: AnalyticsPageCode[] = [
  'sales',
  'products',
  'categories',
  'payments',
]
export const PRO_TIER_PAGES: AnalyticsPageCode[] = [
  'staff',
  'customers',
  'heatmap',
  'channels',
]
export const ULTRA_TIER_PAGES: AnalyticsPageCode[] = [
  'branches',
  'financial',
  'forecasting',
  'alerts',
]

// ============================================
// DEFAULT VIEWS (HARDCODED - NOT IN DATABASE)
// ============================================

/**
 * Default views for Products page
 */
const PRODUCTS_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-products-top',
    name: 'Топ продаж',
    nameEn: 'Top Sellers',
    pageCode: 'products',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.LAST_7_DAYS },
      columns: ['name', 'quantity', 'revenue', 'share', 'abcClass'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
  {
    id: 'default-products-category',
    name: 'По категориям',
    nameEn: 'By Category',
    pageCode: 'products',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.LAST_7_DAYS },
      columns: ['categoryName', 'name', 'revenue', 'share'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * Default views for Categories page
 */
const CATEGORIES_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-categories-revenue',
    name: 'По выручке',
    nameEn: 'By Revenue',
    pageCode: 'categories',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.LAST_7_DAYS },
      columns: ['name', 'productsCount', 'revenue', 'share'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * Default views for Staff page
 */
const STAFF_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-staff-revenue',
    name: 'По выручке',
    nameEn: 'By Revenue',
    pageCode: 'staff',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.THIS_WEEK },
      columns: ['name', 'role', 'orders', 'revenue', 'tips'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * Default views for Customers page
 */
const CUSTOMERS_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-customers-revenue',
    name: 'По выручке',
    nameEn: 'By Revenue',
    pageCode: 'customers',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.LAST_30_DAYS },
      columns: ['name', 'segment', 'orders', 'revenue', 'lastVisit'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
  {
    id: 'default-customers-segment',
    name: 'По сегментам',
    nameEn: 'By Segment',
    pageCode: 'customers',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.LAST_30_DAYS },
      columns: ['name', 'segment', 'orders', 'revenue'],
      sorting: { column: 'segment', direction: SortDirection.ASC },
    },
  },
]

/**
 * Default views for Channels page
 */
const CHANNELS_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-channels-revenue',
    name: 'По выручке',
    nameEn: 'By Revenue',
    pageCode: 'channels',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.THIS_WEEK },
      columns: ['label', 'orders', 'revenue', 'share', 'avgCheck'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * Default views for Payments page
 */
const PAYMENTS_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-payments-amount',
    name: 'По сумме',
    nameEn: 'By Amount',
    pageCode: 'payments',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.THIS_WEEK },
      columns: ['label', 'transactions', 'amount', 'share', 'avgAmount'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * Default views for Branches page
 */
const BRANCHES_DEFAULT_VIEWS: IDefaultView[] = [
  {
    id: 'default-branches-comparison',
    name: 'Сравнение',
    nameEn: 'Comparison',
    pageCode: 'branches',
    isDefault: true,
    isPinned: false,
    isShared: false,
    config: {
      timeframe: { type: PeriodType.THIS_WEEK },
      columns: ['name', 'revenue', 'orders', 'avgCheck', 'vsAvg'],
      sorting: { column: SortBy.REVENUE, direction: SortDirection.DESC },
    },
  },
]

/**
 * All default views grouped by page code
 */
export const DEFAULT_VIEWS: Record<AnalyticsPageCode, IDefaultView[]> = {
  sales: [], // Sales overview doesn't have views (it's a summary)
  products: PRODUCTS_DEFAULT_VIEWS,
  categories: CATEGORIES_DEFAULT_VIEWS,
  payments: PAYMENTS_DEFAULT_VIEWS,
  staff: STAFF_DEFAULT_VIEWS,
  customers: CUSTOMERS_DEFAULT_VIEWS,
  heatmap: [], // Heatmap doesn't have views
  channels: CHANNELS_DEFAULT_VIEWS,
  branches: BRANCHES_DEFAULT_VIEWS,
  financial: [], // Financial pages have tabs, not views
  forecasting: [], // Forecasting has its own config
  alerts: [], // Alerts page doesn't have views
}

/**
 * Get default views for a specific page
 */
export function getDefaultViews(pageCode: AnalyticsPageCode): IDefaultView[] {
  return DEFAULT_VIEWS[pageCode] || []
}

// ============================================
// VIEW LIMITS BY TIER
// ============================================

/**
 * Maximum number of custom views per page by tier
 * Per docs/26-analytics-views.md - Subscription Tiers table
 */
export const VIEW_LIMITS = {
  analytics_basic: 0, // Cannot create custom views
  analytics_pro: 3, // Up to 3 custom views per page
  analytics_full: Infinity, // Unlimited
} as const

// ============================================
// UPGRADE PROMPTS
// ============================================

export const UPGRADE_PROMPTS = {
  pro: {
    title: 'Требуется PRO план',
    titleEn: 'PRO plan required',
    description: 'Эта функция доступна на плане PRO и выше.',
    buttonText: 'Перейти на PRO',
    buttonTextEn: 'Upgrade to PRO',
  },
  ultra: {
    title: 'Требуется ULTRA план',
    titleEn: 'ULTRA plan required',
    description: 'Эта функция доступна только на плане ULTRA.',
    buttonText: 'Перейти на ULTRA',
    buttonTextEn: 'Upgrade to ULTRA',
  },
  viewLimit: {
    title: 'Достигнут лимит представлений',
    titleEn: 'View limit reached',
    description:
      'Вы достигли максимума в 3 представления на плане PRO. Удалите представление или перейдите на ULTRA для неограниченного количества.',
    buttonText: 'Перейти на ULTRA',
    buttonTextEn: 'Upgrade to ULTRA',
  },
} as const

// ============================================
// ABC CLASSIFICATION COLORS
// ============================================

export const ABC_CLASS_COLORS = {
  A: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  B: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
  C: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
} as const

// ============================================
// HEATMAP CELL COLORS
// ============================================

export const HEATMAP_LEVEL_CONFIG = {
  low: { min: 0, max: 5, color: 'bg-gray-100 dark:bg-gray-800' },
  medium: { min: 6, max: 15, color: 'bg-yellow-200 dark:bg-yellow-900/50' },
  high: { min: 16, max: 30, color: 'bg-orange-300 dark:bg-orange-800/50' },
  peak: { min: 31, max: Infinity, color: 'bg-red-400 dark:bg-red-700/50' },
} as const

// ============================================
// MARGIN CLASS COLORS
// ============================================

export const MARGIN_CLASS_COLORS = {
  HIGH: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  MEDIUM:
    'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
  LOW: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30',
  NEGATIVE: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
} as const

// ============================================
// BENCHMARK STATUS COLORS
// ============================================

export const BENCHMARK_STATUS_COLORS = {
  ABOVE: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30',
  AVERAGE:
    'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30',
  BELOW: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30',
} as const

// ============================================
// ALERT SEVERITY COLORS
// ============================================

export const ALERT_SEVERITY_COLORS = {
  CRITICAL:
    'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 border-red-200 dark:border-red-800',
  WARNING:
    'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800',
  INFO: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
} as const

// ============================================
// COHORT RETENTION COLORS
// ============================================

export const COHORT_RETENTION_COLORS = {
  high: { min: 50, color: 'bg-green-200 dark:bg-green-800/50' },
  medium: { min: 30, color: 'bg-yellow-200 dark:bg-yellow-800/50' },
  low: { min: 15, color: 'bg-orange-200 dark:bg-orange-800/50' },
  veryLow: { min: 0, color: 'bg-red-200 dark:bg-red-800/50' },
} as const
