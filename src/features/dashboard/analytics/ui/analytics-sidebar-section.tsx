/**
 * Analytics Sidebar Section
 * Combines analytics pages with custom views
 * Filters pages based on user entitlements
 */

'use client'

import * as React from 'react'

import { Link } from '@tanstack/react-router'

import { IconChevronRight, IconPlus } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

import { usePathname } from '@/shared/lib/navigation'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/shared/ui/base/hover-card'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/shared/ui/base/sidebar'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Icons } from '@/shared/ui/icons'

import { useViews } from '@/entities/dashboard/view'
import { ViewTypeModal } from '@/features/dashboard/view-builder'

import { PAGE_ACCESS_CONFIG } from '../model/constants'
import { useVisiblePages, useViewAccess } from '../model/hooks'

import type { AnalyticsPageCode } from '../model/types'

// Analytics page URLs mapping
const ANALYTICS_PAGE_URLS: Record<AnalyticsPageCode, string> = {
  sales: '/dashboard/analytics/sales',
  products: '/dashboard/analytics/products',
  categories: '/dashboard/analytics/categories',
  payments: '/dashboard/analytics/payments',
  staff: '/dashboard/analytics/staff',
  customers: '/dashboard/analytics/customers',
  heatmap: '/dashboard/analytics/heatmap',
  channels: '/dashboard/analytics/channels',
  branches: '/dashboard/analytics/branches',
  financial: '/dashboard/analytics/financial',
  forecasting: '/dashboard/analytics/forecasting',
  alerts: '/dashboard/analytics/alerts',
}

export function AnalyticsSidebarSection() {
  const { t } = useTranslation('analytics')
  const pathname = usePathname()
  const { state, isMobile } = useSidebar()
  // On mobile, always show expanded view (never show HoverCard tooltips)
  const isCollapsed = state === 'collapsed' && !isMobile
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Get visible pages based on entitlements
  const { visiblePages, isLoading: isPagesLoading } = useVisiblePages()

  // Get custom views
  const { data: views, isLoading: isViewsLoading } = useViews()

  // Check if user can create views
  const { canCreateViews, userTier } = useViewAccess(
    'products',
    views?.length ?? 0
  )

  // Debug: log current tier
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isPagesLoading) {
      console.log(
        '[Analytics] User tier:',
        userTier,
        'Can create views:',
        canCreateViews
      )
    }
  }, [userTier, canCreateViews, isPagesLoading])

  const isLoading = isPagesLoading || isViewsLoading

  // Check if current path is in analytics
  const isAnalyticsActive =
    pathname.startsWith('/dashboard/analytics') ||
    pathname.startsWith('/dashboard/views')

  // Get first visible page icon for collapsed state
  const firstPageIcon = visiblePages[0]
    ? PAGE_ACCESS_CONFIG[visiblePages[0]].icon
    : 'chartBar'
  const FirstIcon = Icons[firstPageIcon as keyof typeof Icons] || Icons.chartBar

  if (isCollapsed) {
    return (
      <>
        <SidebarMenuItem>
          <HoverCard openDelay={0} closeDelay={100}>
            <HoverCardTrigger asChild>
              <SidebarMenuButton tooltip={t('analytics.title')}>
                <FirstIcon className="!size-6" />
                <span className="text-[17px]">{t('analytics.title')}</span>
              </SidebarMenuButton>
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              align="start"
              sideOffset={8}
              className="max-h-80 w-48 overflow-y-auto p-1"
            >
              <div className="flex flex-col gap-0.5">
                <div className="text-muted-foreground px-2 py-1.5 text-xs font-medium tracking-wider uppercase">
                  {t('analytics.title')}
                </div>

                {/* Loading State */}
                {isLoading && (
                  <>
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="mx-2 h-7 w-full" />
                    ))}
                  </>
                )}

                {/* Analytics Pages */}
                {!isLoading &&
                  visiblePages.map((pageCode) => {
                    const config = PAGE_ACCESS_CONFIG[pageCode]
                    const url = ANALYTICS_PAGE_URLS[pageCode]
                    const PageIcon =
                      Icons[config.icon as keyof typeof Icons] || Icons.chartBar

                    return (
                      <Link
                        key={pageCode}
                        to={url}
                        className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
                          pathname === url
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : ''
                        }`}
                      >
                        <PageIcon className="h-6 w-6" />
                        {t(`${pageCode}.title`)}
                      </Link>
                    )
                  })}

                {/* Divider if there are custom views */}
                {!isLoading && views && views.length > 0 && (
                  <div className="mx-2 my-1 border-t" />
                )}

                {/* Custom Views */}
                {!isLoading &&
                  views?.map((view) => (
                    <Link
                      key={view.id}
                      to={`/dashboard/views/${view.id}` as any}
                      className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                        pathname === `/dashboard/views/${view.id}`
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : ''
                      }`}
                    >
                      {view.name}
                      {view.isPinned && (
                        <span className="text-muted-foreground text-xs">*</span>
                      )}
                    </Link>
                  ))}

                {/* Add View Button */}
                {!isLoading && canCreateViews && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-muted-foreground hover:bg-sidebar-accent hover:text-foreground flex items-center rounded-md px-2 py-1.5 text-sm transition-colors"
                  >
                    <IconPlus className="mr-1 size-4" />
                    {t('dashboard.views.create')}
                  </button>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </SidebarMenuItem>

        <ViewTypeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    )
  }

  return (
    <>
      <Collapsible
        defaultOpen={isAnalyticsActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            {/* Group header - small, without icon */}
            <SidebarMenuButton tooltip={t('analytics.title')} size="sm">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                {t('analytics.title')}
              </span>
              <IconChevronRight className="ml-auto h-3 w-3 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="!ml-0 !border-l-0 !pl-0">
              {/* Loading State */}
              {isLoading && (
                <>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <SidebarMenuSubItem key={i}>
                      <Skeleton className="mx-3 h-8 w-32" />
                    </SidebarMenuSubItem>
                  ))}
                </>
              )}

              {/* Analytics Pages */}
              {!isLoading &&
                visiblePages.map((pageCode) => {
                  const config = PAGE_ACCESS_CONFIG[pageCode]
                  const url = ANALYTICS_PAGE_URLS[pageCode]
                  const PageIcon =
                    Icons[config.icon as keyof typeof Icons] || Icons.chartBar

                  return (
                    <SidebarMenuSubItem key={pageCode}>
                      <SidebarMenuSubButton
                        className="!p-3"
                        asChild
                        isActive={pathname === url}
                      >
                        <Link to={url} className="flex items-center gap-2">
                          <PageIcon className="!h-[1.25rem] !w-[1.25rem]" />
                          <span className="text-[17px]">
                            {t(`${pageCode}.title`)}
                          </span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}

              {/* Divider if there are custom views */}
              {!isLoading && views && views.length > 0 && (
                <SidebarMenuSubItem>
                  <div className="mx-3 my-2 border-t" />
                </SidebarMenuSubItem>
              )}

              {/* Custom Views */}
              {!isLoading &&
                views?.map((view) => (
                  <SidebarMenuSubItem key={view.id}>
                    <SidebarMenuSubButton
                      className="!p-3"
                      asChild
                      isActive={pathname === `/dashboard/views/${view.id}`}
                    >
                      <Link
                        to={`/dashboard/views/${view.id}` as any}
                        className="flex items-center gap-2"
                      >
                        <Icons.chartPie className="h-6 w-6" />
                        <span className="text-[17px]">{view.name}</span>
                        {view.isPinned && (
                          <span className="text-muted-foreground ml-auto text-xs">
                            *
                          </span>
                        )}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}

              {/* Add View Button - only show if user can create views (PRO plan) */}
              {!isLoading && canCreateViews && (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    className="text-muted-foreground hover:text-foreground !p-3"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <IconPlus className="mr-1 size-4" />
                    <span className="text-[17px]">
                      {t('dashboard.views.create')}
                    </span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Modal for creating new view */}
      <ViewTypeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
