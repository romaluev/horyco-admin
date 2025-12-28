/**
 * Analytics Sidebar Section
 * Combines analytics pages with custom views
 * Filters pages based on user entitlements
 */

'use client'

import * as React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { IconChevronRight, IconPlus, IconReportAnalytics } from '@tabler/icons-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/base/collapsible'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/shared/ui/base/sidebar'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useViews } from '@/entities/view'
import { ViewTypeModal } from '@/features/view-builder'

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
  const pathname = usePathname()
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  // Get visible pages based on entitlements
  const { visiblePages, isLoading: isPagesLoading } = useVisiblePages()

  // Get custom views
  const { data: views, isLoading: isViewsLoading } = useViews()

  // Check if user can create views
  const { canCreateViews, userTier } = useViewAccess('products', views?.length ?? 0)

  // Debug: log current tier
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isPagesLoading) {
      console.log('[Analytics] User tier:', userTier, 'Can create views:', canCreateViews)
    }
  }, [userTier, canCreateViews, isPagesLoading])

  const isLoading = isPagesLoading || isViewsLoading

  // Check if current path is in analytics
  const isAnalyticsActive = pathname.startsWith('/dashboard/analytics') || pathname.startsWith('/dashboard/views')

  return (
    <>
      <Collapsible
        defaultOpen={isAnalyticsActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="Аналитика">
              <IconReportAnalytics className="!size-6" />
              <span className="text-[17px]">Аналитика</span>
              <IconChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
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

                  return (
                    <SidebarMenuSubItem key={pageCode}>
                      <SidebarMenuSubButton
                        className="!p-3"
                        asChild
                        isActive={pathname === url}
                      >
                        <Link href={url}>
                          <span className="text-[17px]">{config.title}</span>
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
                      <Link href={`/dashboard/views/${view.id}`}>
                        <span className="text-[17px]">{view.name}</span>
                        {view.isPinned && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            *
                          </span>
                        )}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}

              {/* Add View Button */}
              {!isLoading && (
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    className="!p-3 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <IconPlus className="mr-1 size-4" />
                    <span className="text-[17px]">Добавить представление</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>

      {/* Modal for creating new view */}
      <ViewTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
