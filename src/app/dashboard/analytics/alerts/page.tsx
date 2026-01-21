/**
 * Alerts Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 11: Alerts Analytics
 *
 * ULTRA tier - Requires analytics_full entitlement
 * Shows active alerts and anomaly detection
 */

'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  IconAlertCircle,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'

import { PeriodType } from '@/shared/api/graphql'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import { Skeleton } from '@/shared/ui/base/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  useAlertSummary,
  useAlerts,
  AnalyticsPageLayout,
  AnalyticsErrorState,
  ALERT_SEVERITY_COLORS,
} from '@/features/dashboard/analytics'

import type { IAlertItem } from '@/features/dashboard/analytics'

// ============================================
// MAIN COMPONENT
// ============================================

export default function AlertsPage() {
  const { t } = useTranslation('analytics')
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [activeTab, setActiveTab] = React.useState('active')

  // Use alertSummary for health score (no status param per doc 23)
  const { data: summaryData } = useAlertSummary({})

  // Use alerts query for alerts list (has status param)
  const { data: alertsData, isLoading, error, refetch } = useAlerts({
    status: activeTab === 'active' ? 'ACTIVE' : undefined,
  })

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export alerts')
  }

  // Calculate total active from summary (with defensive checks)
  const totalActive = summaryData?.activeAlerts
    ? (summaryData.activeAlerts.critical ?? 0) + (summaryData.activeAlerts.warning ?? 0) + (summaryData.activeAlerts.info ?? 0)
    : 0

  return (
    <AnalyticsPageLayout
      pageCode="alerts"
      title={t('alerts.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            {t('alerts.tabs.active')}
            {totalActive > 0 ? (
              <span className="ml-2 rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                {totalActive}
              </span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="history">{t('alerts.tabs.history')}</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <AlertsSkeleton />
          ) : error ? (
            <AnalyticsErrorState onRetry={() => refetch()} />
          ) : !alertsData || !Array.isArray(alertsData) || alertsData.length === 0 ? (
            <EmptyAlertsState />
          ) : (
            <AlertsList alerts={alertsData} />
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          {isLoading ? (
            <AlertsSkeleton />
          ) : error ? (
            <AnalyticsErrorState onRetry={() => refetch()} />
          ) : !alertsData || !Array.isArray(alertsData) || alertsData.length === 0 ? (
            <EmptyAlertsState />
          ) : (
            <AlertsList alerts={alertsData} />
          )}
        </TabsContent>
      </Tabs>
    </AnalyticsPageLayout>
  )
}

// ============================================
// ALERTS LIST
// ============================================

interface IAlertsListProps {
  alerts: IAlertItem[]
}

function AlertsList({ alerts }: IAlertsListProps) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}

// ============================================
// ALERT CARD
// ============================================

interface IAlertCardProps {
  alert: IAlertItem
}

function AlertCard({ alert }: IAlertCardProps) {
  const { t } = useTranslation('analytics')
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    CRITICAL: IconAlertCircle,
    WARNING: IconAlertTriangle,
    INFO: IconInfoCircle,
  }

  const Icon = icons[alert.severity] || IconInfoCircle

  const handleDismiss = () => {
    // TODO: Implement dismiss
    console.log('Dismiss alert:', alert.id)
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        ALERT_SEVERITY_COLORS[alert.severity]
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Icon className="mt-0.5 size-5 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium">{getSeverityLabel(alert.severity, t)}</span>
              <span className="text-sm">- {alert.title}</span>
            </div>
            <p className="mt-1 text-sm opacity-90">{alert.message}</p>
            <div className="mt-2 flex items-center gap-4 text-xs opacity-70">
              <span>{t('alerts.card.detected', { time: formatDateTime(alert.detectedAt) })}</span>
              {alert.branchName && <span>{t('alerts.card.branch', { name: alert.branchName })}</span>}
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={handleDismiss}
        >
          <IconX className="size-4" />
        </Button>
      </div>
    </div>
  )
}

function getSeverityLabel(severity: string, t: any): string {
  const labels: Record<string, string> = {
    CRITICAL: t('alerts.severity.critical'),
    WARNING: t('alerts.severity.warning'),
    INFO: t('alerts.severity.info'),
  }
  return labels[severity] || severity
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()

  if (isToday) {
    return `Сегодня ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`
  }

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ============================================
// EMPTY STATE
// ============================================

function EmptyAlertsState() {
  const { t } = useTranslation('analytics')
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <IconInfoCircle className="size-12 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-medium">{t('alerts.empty.title')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {t('alerts.empty.description')}
      </p>
    </div>
  )
}

// ============================================
// SKELETON
// ============================================

function AlertsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-lg" />
      ))}
    </div>
  )
}
