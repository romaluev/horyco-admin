/**
 * Analytics Page Layout Component
 * Based on docs: 25-analytics-pages.md - Common Page Structure
 *
 * Every analytics page follows this layout:
 * - Header with back, title, views dropdown, period selector
 * - Filters row
 * - Data Table (primary focus)
 * - Pagination
 * - Export option
 */

'use client'

import * as React from 'react'

import Link from 'next/link'

import { IconArrowLeft, IconDownload } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { PERIOD_OPTIONS } from '@/features/dashboard/view-builder/model/constants'

import { useAnalyticsPageAccess } from '../model/hooks'
import { LockedPageState } from './locked-page-state'

import type { AnalyticsPageCode } from '../model/types'
import type { PeriodType } from '@/shared/api/graphql'

// ============================================
// TYPES
// ============================================

interface IAnalyticsPageLayoutProps {
  /** The page code for entitlement checking */
  pageCode: AnalyticsPageCode
  /** Page title */
  title: string
  /** Current period */
  period: PeriodType
  /** Period change handler */
  onPeriodChange: (period: PeriodType) => void
  /** Optional: Back link URL (defaults to /dashboard/analytics) */
  backHref?: string
  /** Optional: Back link label */
  backLabel?: string
  /** Optional: Export handler */
  onExport?: () => void
  /** Optional: Whether export is loading */
  isExporting?: boolean
  /** Children content */
  children: React.ReactNode
  /** Optional: Custom header actions */
  headerActions?: React.ReactNode
  /** Optional: Filters section */
  filters?: React.ReactNode
  /** Optional: Whether data is loading */
  isLoading?: boolean
}

/**
 * Standard layout for all analytics pages
 *
 * Per docs/25-analytics-pages.md:
 * ```
 * +------------------------------------------------------------------+
 * |  <- Back    [Page Title]         [Views: Default v] [Period v]    |
 * |                                                                   |
 * |  [Filters Row: Search, Category, Channel, etc.]                   |
 * |                                                                   |
 * |  Data Table                                                       |
 * |  +---------------------------------------------------------------+|
 * |  | Column 1 ^ | Column 2     | Column 3     | Column 4        |  |
 * |  |------------|--------------|--------------|-----------------|  |
 * |  | Row 1      | ...          | ...          | ...             |  |
 * |  +---------------------------------------------------------------+|
 * |                                                                   |
 * |  Showing 1-20 of 156                        [<] [1] [2] [3] [>]   |
 * |  [Export CSV]                                                     |
 * +------------------------------------------------------------------+
 * ```
 */
export function AnalyticsPageLayout({
  pageCode,
  title,
  period,
  onPeriodChange,
  backHref = '/dashboard/analytics',
  backLabel = 'Аналитика',
  onExport,
  isExporting = false,
  children,
  headerActions,
  filters,
  isLoading = false,
}: IAnalyticsPageLayoutProps) {
  const { canAccess, isLoading: isCheckingAccess, config, requiredTier } = useAnalyticsPageAccess(pageCode)

  // Show loading skeleton while checking access
  if (isCheckingAccess) {
    return <AnalyticsPageSkeleton />
  }

  // Show locked state if user doesn't have access
  if (!canAccess) {
    return <LockedPageState config={config} requiredTier={requiredTier} />
  }

  return (
    <div className="flex h-full flex-col gap-4 p-4 md:gap-6 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link href={backHref}>
            <Button variant="ghost" size="icon" className="size-8">
              <IconArrowLeft className="size-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{backLabel}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {headerActions}

          {/* Period Selector */}
          <Select value={period} onValueChange={(value) => onPeriodChange(value as PeriodType)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PERIOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filters Row */}
      {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}

      {/* Main Content */}
      <div className="flex-1">{isLoading ? <ContentSkeleton /> : children}</div>

      {/* Footer with Export */}
      {onExport && (
        <div className="flex justify-start border-t pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={isExporting}
          >
            <IconDownload className="mr-1.5 size-4" />
            {isExporting ? 'Экспорт...' : 'Экспорт CSV'}
          </Button>
        </div>
      )}
    </div>
  )
}

// ============================================
// SKELETON COMPONENTS
// ============================================

function AnalyticsPageSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4 p-4 md:gap-6 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-9 w-[180px]" />
      </div>
      <ContentSkeleton />
    </div>
  )
}

function ContentSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-[200px]" />
        <Skeleton className="h-9 w-[120px]" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface IAnalyticsPageHeaderProps {
  title: string
  description?: string
  backHref?: string
  actions?: React.ReactNode
}

export function AnalyticsPageHeader({
  title,
  description,
  backHref = '/dashboard/analytics',
  actions,
}: IAnalyticsPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <Link href={backHref}>
          <Button variant="ghost" size="icon" className="size-8">
            <IconArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ============================================
// EMPTY STATE
// ============================================

interface IEmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}

export function AnalyticsEmptyState({
  icon,
  title,
  description,
  action,
}: IEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12 text-center">
      {icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  )
}

// ============================================
// ERROR STATE
// ============================================

interface IErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function AnalyticsErrorState({
  title = 'Ошибка загрузки данных',
  description = 'Не удалось загрузить аналитические данные',
  onRetry,
}: IErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-destructive/50 bg-destructive/5 p-12 text-center">
      <div className="space-y-1">
        <p className="font-medium text-destructive">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Повторить
        </Button>
      )}
    </div>
  )
}
