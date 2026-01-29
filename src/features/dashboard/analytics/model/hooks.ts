/**
 * Analytics Hooks
 * Based on docs: 25-analytics-pages.md, 26-analytics-views.md
 */

import * as React from 'react'

import { useEntitlements } from '@/entities/dashboard/dashboard'

import { DEFAULT_VIEWS, PAGE_ACCESS_CONFIG, VIEW_LIMITS } from './constants'

import type {
  AnalyticsPageCode,
  EntitlementTier,
  IDefaultView,
  IPageAccessConfig,
} from './types'

// ============================================
// PAGE ACCESS HOOK
// ============================================

export interface IPageAccessResult {
  /** Whether the user can access this page */
  canAccess: boolean
  /** Whether entitlements are still loading */
  isLoading: boolean
  /** The required tier for this page */
  requiredTier: EntitlementTier
  /** User's current highest tier */
  userTier: EntitlementTier | null
  /** The page configuration */
  config: IPageAccessConfig
}

/**
 * Hook to check if user can access a specific analytics page
 *
 * Per docs/25-analytics-pages.md - Page Access by Tier:
 * - analytics_basic: Sales, Products, Categories, Payments
 * - analytics_pro: Staff, Customers, Heatmap, Channels
 * - analytics_full: Branches, Financial, Forecasting, Alerts
 *
 * @example
 * ```tsx
 * const { canAccess, isLoading, config } = useAnalyticsPageAccess('staff')
 *
 * if (isLoading) return <LoadingSkeleton />
 * if (!canAccess) return <LockedPageState config={config} />
 * return <StaffAnalyticsPage />
 * ```
 */
export function useAnalyticsPageAccess(
  pageCode: AnalyticsPageCode
): IPageAccessResult {
  const { data: entitlements, isLoading } = useEntitlements()

  const config = PAGE_ACCESS_CONFIG[pageCode]
  const requiredTier = config.requiredTier

  // Determine user's current tier
  const userTier = React.useMemo<EntitlementTier | null>(() => {
    if (!entitlements) return null
    if (entitlements.analytics_full) return 'analytics_full'
    if (entitlements.analytics_pro) return 'analytics_pro'
    if (entitlements.analytics_basic) return 'analytics_basic'
    return null
  }, [entitlements])

  // Check if user can access
  const canAccess = React.useMemo(() => {
    if (!entitlements) return false

    switch (requiredTier) {
      case 'analytics_basic':
        return (
          entitlements.analytics_basic ||
          entitlements.analytics_pro ||
          entitlements.analytics_full
        )
      case 'analytics_pro':
        return entitlements.analytics_pro || entitlements.analytics_full
      case 'analytics_full':
        return entitlements.analytics_full
      default:
        return false
    }
  }, [entitlements, requiredTier])

  return {
    canAccess,
    isLoading,
    requiredTier,
    userTier,
    config,
  }
}

// ============================================
// VIEW ACCESS HOOKS
// ============================================

export interface IViewAccessResult {
  /** Whether user can create custom views */
  canCreateViews: boolean
  /** Whether user can edit/delete custom views */
  canManageViews: boolean
  /** Whether user can share views with team */
  canShareViews: boolean
  /** Whether user can pin views */
  canPinViews: boolean
  /** Maximum number of custom views allowed */
  maxViews: number
  /** Current number of custom views for this page */
  currentViewCount: number
  /** Whether user has reached view limit */
  hasReachedLimit: boolean
  /** User's current tier */
  userTier: EntitlementTier | null
  /** Whether entitlements are loading */
  isLoading: boolean
}

/**
 * Hook to check user's view-related permissions
 *
 * Per docs/26-analytics-views.md - Subscription Tiers:
 * - BASIC: Use default views only, cannot create custom views
 * - PRO: Create up to 3 custom views per page, edit, delete, pin
 * - ULTRA: Unlimited custom views + sharing
 *
 * @example
 * ```tsx
 * const { canCreateViews, hasReachedLimit } = useViewAccess('products', customViews.length)
 *
 * if (!canCreateViews) {
 *   // Show upgrade prompt
 * }
 * ```
 */
export function useViewAccess(
  pageCode: AnalyticsPageCode,
  currentViewCount: number = 0
): IViewAccessResult {
  const { data: entitlements, isLoading } = useEntitlements()

  const result = React.useMemo<Omit<IViewAccessResult, 'isLoading'>>(() => {
    if (!entitlements) {
      return {
        canCreateViews: false,
        canManageViews: false,
        canShareViews: false,
        canPinViews: false,
        maxViews: 0,
        currentViewCount,
        hasReachedLimit: true,
        userTier: null,
      }
    }

    // Determine tier
    let userTier: EntitlementTier | null = null
    if (entitlements.analytics_full) userTier = 'analytics_full'
    else if (entitlements.analytics_pro) userTier = 'analytics_pro'
    else if (entitlements.analytics_basic) userTier = 'analytics_basic'

    // Get limits based on tier
    const maxViews = userTier ? VIEW_LIMITS[userTier] : 0
    const hasReachedLimit = currentViewCount >= maxViews

    return {
      canCreateViews:
        userTier === 'analytics_pro' || userTier === 'analytics_full',
      canManageViews:
        userTier === 'analytics_pro' || userTier === 'analytics_full',
      canShareViews: userTier === 'analytics_full',
      canPinViews:
        userTier === 'analytics_pro' || userTier === 'analytics_full',
      maxViews: maxViews === Infinity ? -1 : maxViews,
      currentViewCount,
      hasReachedLimit,
      userTier,
    }
  }, [entitlements, currentViewCount])

  return {
    ...result,
    isLoading,
  }
}

// ============================================
// DEFAULT VIEWS HOOK
// ============================================

export interface IDefaultViewsResult {
  /** Default views for the page (hardcoded) */
  defaultViews: IDefaultView[]
  /** Find a default view by ID */
  getDefaultView: (id: string) => IDefaultView | undefined
}

/**
 * Hook to get default views for a page
 *
 * Per docs/26-analytics-views.md:
 * Default views are hardcoded in frontend (NOT stored in database)
 * Available to all users, cannot be edited or deleted
 *
 * @example
 * ```tsx
 * const { defaultViews, getDefaultView } = useDefaultViews('products')
 *
 * // Combine with custom views from API
 * const allViews = [...defaultViews, ...customViews]
 * ```
 */
export function useDefaultViews(
  pageCode: AnalyticsPageCode
): IDefaultViewsResult {
  const defaultViews = React.useMemo(() => {
    return DEFAULT_VIEWS[pageCode] || []
  }, [pageCode])

  const getDefaultView = React.useCallback(
    (id: string) => {
      return defaultViews.find((v) => v.id === id)
    },
    [defaultViews]
  )

  return {
    defaultViews,
    getDefaultView,
  }
}

// ============================================
// VISIBLE PAGES HOOK
// ============================================

export interface IVisiblePagesResult {
  /** List of page codes user can access */
  visiblePages: AnalyticsPageCode[]
  /** Check if a specific page is visible */
  isPageVisible: (pageCode: AnalyticsPageCode) => boolean
  /** Whether loading */
  isLoading: boolean
}

/**
 * Hook to get list of analytics pages visible to user
 *
 * Per docs/25-analytics-pages.md - Page Visibility Logic:
 * - BASIC: sales, products, categories, payments
 * - PRO: + staff, customers, heatmap, channels
 * - ULTRA: + branches, financial, forecasting, alerts
 *
 * @example
 * ```tsx
 * const { visiblePages } = useVisiblePages()
 *
 * return (
 *   <nav>
 *     {visiblePages.map(page => (
 *       <Link key={page} href={`/analytics/${page}`}>
 *         {PAGE_ACCESS_CONFIG[page].title}
 *       </Link>
 *     ))}
 *   </nav>
 * )
 * ```
 */
export function useVisiblePages(): IVisiblePagesResult {
  const { data: entitlements, isLoading, error } = useEntitlements()

  const visiblePages = React.useMemo<AnalyticsPageCode[]>(() => {
    // Always visible (BASIC tier)
    const pages: AnalyticsPageCode[] = [
      'sales',
      'products',
      'categories',
      'payments',
    ]

    // Debug: log entitlements in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Entitlements:', entitlements, 'Error:', error)
    }

    if (!entitlements) return pages

    // PRO tier pages
    if (entitlements.analytics_pro || entitlements.analytics_full) {
      pages.push('staff', 'customers', 'heatmap', 'channels')
    }

    // ULTRA tier pages
    if (entitlements.analytics_full) {
      pages.push('branches', 'financial', 'forecasting', 'alerts')
    }

    return pages
  }, [entitlements, error])

  const isPageVisible = React.useCallback(
    (pageCode: AnalyticsPageCode) => {
      return visiblePages.includes(pageCode)
    },
    [visiblePages]
  )

  return {
    visiblePages,
    isPageVisible,
    isLoading,
  }
}

// ============================================
// DASHBOARD CUSTOMIZATION HOOK
// ============================================

/**
 * Hook to check if user can customize dashboard
 *
 * Per docs/24-analytics-dashboard.md:
 * - BASIC: Cannot customize (uses default layout)
 * - PRO+: Can customize KPIs, chart, widgets
 * - ULTRA (analytics_full): Full access including dashboard customization
 */
export function useCanCustomizeDashboard(): boolean {
  const { data: entitlements } = useEntitlements()
  return entitlements?.dashboard_custom || entitlements?.analytics_full || false
}
