/**
 * Analytics Index Page
 * Shows navigation to all analytics sub-pages based on user's entitlements
 */

'use client'

import * as React from 'react'

import Link from 'next/link'

import {
  IconChartBar,
  IconChartPie,
  IconCreditCard,
  IconFlame,
  IconLock,
  IconMapPin,
  IconPackage,
  IconReceipt,
  IconTarget,
  IconTrendingUp,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Skeleton } from '@/shared/ui/base/skeleton'

import { useVisiblePages, PAGE_ACCESS_CONFIG } from '@/features/analytics'

import type { AnalyticsPageCode } from '@/features/analytics'

// Page icons mapping
const PAGE_ICONS: Record<AnalyticsPageCode, React.ComponentType<{ className?: string }>> = {
  sales: IconReceipt,
  products: IconPackage,
  categories: IconChartPie,
  payments: IconCreditCard,
  staff: IconUsersGroup,
  customers: IconUsers,
  heatmap: IconFlame,
  channels: IconChartBar,
  branches: IconMapPin,
  financial: IconTrendingUp,
  forecasting: IconTarget,
  alerts: IconChartBar,
}

// All pages in display order
const ALL_PAGES: AnalyticsPageCode[] = [
  'sales',
  'products',
  'categories',
  'payments',
  'staff',
  'customers',
  'heatmap',
  'channels',
  'branches',
  'financial',
  'forecasting',
  'alerts',
]

export default function AnalyticsPage() {
  const { visiblePages, isLoading } = useVisiblePages()

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Аналитика</h1>
        <p className="text-sm text-muted-foreground">
          Исследуйте данные вашего бизнеса
        </p>
      </div>

      {/* Pages Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ALL_PAGES.map((pageCode) => {
          const config = PAGE_ACCESS_CONFIG[pageCode]
          const isVisible = visiblePages.includes(pageCode)
          const Icon = PAGE_ICONS[pageCode]

          if (isVisible) {
            return (
              <Link key={pageCode} href={`/dashboard/analytics/${pageCode}`}>
                <AnalyticsPageCard
                  title={config.title}
                  description={config.description}
                  icon={<Icon className="size-5" />}
                />
              </Link>
            )
          }

          // Show locked card for inaccessible pages
          return (
            <LockedAnalyticsPageCard
              key={pageCode}
              title={config.title}
              description={config.description}
              icon={<Icon className="size-5" />}
              requiredTier={config.requiredTier === 'analytics_full' ? 'ULTRA' : 'PRO'}
            />
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// CARD COMPONENTS
// ============================================

interface IAnalyticsPageCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function AnalyticsPageCard({ title, description, icon }: IAnalyticsPageCardProps) {
  return (
    <Card className="transition-colors hover:bg-muted/50">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

interface ILockedAnalyticsPageCardProps extends IAnalyticsPageCardProps {
  requiredTier: 'PRO' | 'ULTRA'
}

function LockedAnalyticsPageCard({
  title,
  description,
  icon,
  requiredTier,
}: ILockedAnalyticsPageCardProps) {
  return (
    <Card className="opacity-60">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              {icon}
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <IconLock className="size-3" />
            {requiredTier}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
