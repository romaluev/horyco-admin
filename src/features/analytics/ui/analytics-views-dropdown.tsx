/**
 * Analytics Views Dropdown Component
 * Based on docs: 26-analytics-views.md - Screen 1: Views Dropdown
 *
 * Shows:
 * - Pinned views first
 * - Default views (hardcoded)
 * - Custom views (from API)
 * - Save current view option (PRO+)
 * - Upgrade prompt for BASIC users
 */

'use client'

import * as React from 'react'

import { IconCheck, IconPin, IconPlus, IconSettings } from '@tabler/icons-react'

import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useViews } from '@/entities/view'

import { useDefaultViews, useViewAccess } from '../model/hooks'
import { ViewsUpgradePrompt } from './locked-page-state'

import type { AnalyticsPageCode, IDefaultView } from '../model/types'
import type { IView } from '@/shared/api/graphql'

// ============================================
// TYPES
// ============================================

interface IAnalyticsViewsDropdownProps {
  /** The page code to filter views */
  pageCode: AnalyticsPageCode
  /** Currently selected view ID */
  selectedViewId?: string
  /** Callback when a view is selected */
  onViewSelect: (viewId: string, isDefault: boolean) => void
  /** Callback to open save view modal */
  onSaveView?: () => void
  /** Callback to open manage views */
  onManageViews?: () => void
}

/**
 * Views dropdown for analytics pages
 *
 * Per docs/26-analytics-views.md:
 * ```
 * +--------------------------------+
 * | [*] Default                    |
 * +--------------------------------+
 * | [ ] Top Sellers (7 days)    [*]| <- pinned
 * +--------------------------------+
 * | [ ] By Category                |
 * +--------------------------------+
 * | [ ] High Margin Products       |
 * +--------------------------------+
 * | ────────────────────────────── |
 * | [+] Save Current View          |
 * +--------------------------------+
 * ```
 */
export function AnalyticsViewsDropdown({
  pageCode,
  selectedViewId,
  onViewSelect,
  onSaveView,
  onManageViews,
}: IAnalyticsViewsDropdownProps) {
  // Get default views (hardcoded)
  const { defaultViews } = useDefaultViews(pageCode)

  // Get custom views from API
  const { data: customViews, isLoading } = useViews({ pageCode })

  // Check user's view permissions
  const {
    canCreateViews,
    canPinViews,
    hasReachedLimit,
    userTier,
    isLoading: isLoadingAccess,
  } = useViewAccess(pageCode, customViews?.length || 0)

  // Combine and sort views
  const sortedViews = React.useMemo(() => {
    const pinnedCustom = customViews?.filter((v) => v.isPinned) || []
    const unpinnedCustom = customViews?.filter((v) => !v.isPinned) || []

    return {
      pinned: pinnedCustom,
      default: defaultViews,
      custom: unpinnedCustom,
    }
  }, [customViews, defaultViews])

  // Find selected view name
  const selectedViewName = React.useMemo(() => {
    if (!selectedViewId) return 'По умолчанию'

    // Check default views
    const defaultView = defaultViews.find((v) => v.id === selectedViewId)
    if (defaultView) return defaultView.name

    // Check custom views
    const customView = customViews?.find((v) => v.id === selectedViewId)
    if (customView) return customView.name

    return 'По умолчанию'
  }, [selectedViewId, defaultViews, customViews])

  const handleViewClick = (viewId: string, isDefault: boolean) => {
    onViewSelect(viewId, isDefault)
  }

  const handleSaveClick = () => {
    if (hasReachedLimit) {
      // Show limit reached state - this is handled by parent
    } else if (onSaveView) {
      onSaveView()
    }
  }

  if (isLoading || isLoadingAccess) {
    return <Skeleton className="h-9 w-[180px]" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          <span className="truncate">{selectedViewName}</span>
          <IconSettings className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[240px]">
        {/* Pinned Views */}
        {sortedViews.pinned.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Закрепленные
            </DropdownMenuLabel>
            {sortedViews.pinned.map((view) => (
              <ViewMenuItem
                key={view.id}
                view={view}
                isSelected={selectedViewId === view.id}
                isPinned
                onClick={() => handleViewClick(view.id, false)}
              />
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Default Views */}
        {sortedViews.default.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              По умолчанию
            </DropdownMenuLabel>
            {sortedViews.default.map((view) => (
              <DefaultViewMenuItem
                key={view.id}
                view={view}
                isSelected={selectedViewId === view.id}
                onClick={() => handleViewClick(view.id, true)}
              />
            ))}
            {sortedViews.custom.length > 0 && <DropdownMenuSeparator />}
          </>
        )}

        {/* Custom Views */}
        {sortedViews.custom.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Мои представления
            </DropdownMenuLabel>
            {sortedViews.custom.map((view) => (
              <ViewMenuItem
                key={view.id}
                view={view}
                isSelected={selectedViewId === view.id}
                onClick={() => handleViewClick(view.id, false)}
              />
            ))}
          </>
        )}

        {/* Actions */}
        {canCreateViews ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSaveClick} disabled={hasReachedLimit}>
              <IconPlus className="mr-2 size-4" />
              Сохранить текущий вид
              {hasReachedLimit && (
                <span className="ml-auto text-xs text-muted-foreground">
                  Лимит
                </span>
              )}
            </DropdownMenuItem>
            {onManageViews && (
              <DropdownMenuItem onClick={onManageViews}>
                <IconSettings className="mr-2 size-4" />
                Управление представлениями
              </DropdownMenuItem>
            )}
          </>
        ) : (
          // BASIC users see upgrade prompt
          userTier === 'analytics_basic' && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <ViewsUpgradePrompt />
              </div>
            </>
          )
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ============================================
// VIEW MENU ITEMS
// ============================================

interface IViewMenuItemProps {
  view: IView
  isSelected: boolean
  isPinned?: boolean
  onClick: () => void
}

function ViewMenuItem({ view, isSelected, isPinned, onClick }: IViewMenuItemProps) {
  return (
    <DropdownMenuItem onClick={onClick} className="justify-between">
      <div className="flex items-center gap-2">
        {isSelected && <IconCheck className="size-4" />}
        {!isSelected && <span className="size-4" />}
        <span className="truncate">{view.name}</span>
      </div>
      {isPinned && <IconPin className="size-3 text-muted-foreground" />}
    </DropdownMenuItem>
  )
}

interface IDefaultViewMenuItemProps {
  view: IDefaultView
  isSelected: boolean
  onClick: () => void
}

function DefaultViewMenuItem({ view, isSelected, onClick }: IDefaultViewMenuItemProps) {
  return (
    <DropdownMenuItem onClick={onClick} className="justify-between">
      <div className="flex items-center gap-2">
        {isSelected && <IconCheck className="size-4" />}
        {!isSelected && <span className="size-4" />}
        <span className="truncate">{view.name}</span>
      </div>
    </DropdownMenuItem>
  )
}
