/**
 * Customers Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 6: Customer Analytics
 *
 * PRO tier - Requires analytics_pro or analytics_full entitlement
 * Shows customer overview with tabs for RFM, Cohorts, etc.
 */

'use client'

import * as React from 'react'

import { useTranslation } from 'react-i18next'

import { PeriodType } from '@/shared/api/graphql'
import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Skeleton } from '@/shared/ui/base/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/base/tabs'

import {
  useCustomerOverview,
  useRfmAnalysis,
  useCohortAnalysis,
  AnalyticsPageLayout,
  AnalyticsErrorState,
  COHORT_RETENTION_COLORS,
} from '@/features/dashboard/analytics'

import type {
  ICustomerOverviewData,
  IRfmAnalysisData,
  ICohortAnalysisData,
} from '@/features/dashboard/analytics'

// ============================================
// MAIN COMPONENT
// ============================================

export default function CustomersAnalyticsPage() {
  const { t } = useTranslation('analytics')
  const [period, setPeriod] = React.useState<PeriodType>(
    PeriodType.LAST_30_DAYS
  )
  const [activeTab, setActiveTab] = React.useState('overview')

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export customers analytics')
  }

  return (
    <AnalyticsPageLayout
      pageCode="customers"
      title={t('customers.title')}
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">
            {t('customers.tabs.overview')}
          </TabsTrigger>
          <TabsTrigger value="rfm">{t('customers.tabs.rfm')}</TabsTrigger>
          <TabsTrigger value="cohorts">
            {t('customers.tabs.cohorts')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <CustomerOverviewTab period={period} />
        </TabsContent>

        <TabsContent value="rfm" className="mt-4">
          <RfmAnalysisTab />
        </TabsContent>

        <TabsContent value="cohorts" className="mt-4">
          <CohortAnalysisTab />
        </TabsContent>
      </Tabs>
    </AnalyticsPageLayout>
  )
}

// ============================================
// CUSTOMER OVERVIEW TAB
// ============================================

interface ICustomerOverviewTabProps {
  period: PeriodType
}

function CustomerOverviewTab({ period }: ICustomerOverviewTabProps) {
  const { t } = useTranslation('analytics')
  const { data, isLoading, error, refetch } = useCustomerOverview({
    period: { type: period },
  })

  if (isLoading) return <OverviewSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  // Extract data with defensive checks
  const summary = data.summary ?? {
    totalCustomers: 0,
    activeCustomers: 0,
    newCustomers: 0,
    returningCustomers: 0,
    churnedCustomers: 0,
  }
  const metrics = data.metrics ?? {
    activeRate: 0,
    retentionRate: 0,
    churnRate: 0,
    avgOrdersPerCustomer: 0,
    avgRevenuePerCustomer: 0,
  }
  const segments = data.segments ?? []

  // Map summary fields
  const totalCustomers = summary.totalCustomers ?? 0
  const activeCustomers = summary.activeCustomers ?? 0
  const newCustomers = summary.newCustomers ?? 0
  const returningCustomers = summary.returningCustomers ?? 0
  const churnedCustomers = summary.churnedCustomers ?? 0

  // Map metrics fields
  const activeRate = metrics.activeRate ?? 0
  const retentionRate = metrics.retentionRate ?? 0
  const churnRate = metrics.churnRate ?? 0
  const avgRevenuePerCustomer = metrics.avgRevenuePerCustomer ?? 0

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          label={t('customers.overview.totalCustomers')}
          value={totalCustomers}
        />
        <MetricCard
          label={t('customers.overview.active')}
          value={activeCustomers}
        />
        <MetricCard label={t('customers.overview.new')} value={newCustomers} />
        <MetricCard
          label={t('customers.overview.returning')}
          value={returningCustomers}
        />
        <MetricCard
          label={t('customers.overview.churned')}
          value={churnedCustomers}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label={t('customers.overview.activityRate')}
          value={`${(activeRate ?? 0).toFixed(1)}%`}
        />
        <MetricCard
          label={t('customers.overview.retentionRate')}
          value={`${(retentionRate ?? 0).toFixed(1)}%`}
        />
        <MetricCard
          label={t('customers.overview.churnRate')}
          value={`${(churnRate ?? 0).toFixed(1)}%`}
        />
        <MetricCard
          label={t('customers.overview.avgRevenuePerCustomer')}
          value={formatPrice(avgRevenuePerCustomer)}
        />
      </div>

      {/* Segments Table */}
      <div>
        <h3 className="mb-3 text-sm font-medium">
          {t('customers.overview.segments')}
        </h3>
        {segments.length > 0 ? (
          <SegmentsTable segments={segments} />
        ) : (
          <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border">
            {t('customers.overview.noSegmentData')}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// RFM ANALYSIS TAB
// ============================================

function RfmAnalysisTab() {
  const { t } = useTranslation('analytics')
  const { data, isLoading, error, refetch } = useRfmAnalysis({
    lookbackDays: 365,
  })

  if (isLoading) return <RfmSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  const segments = data.segments ?? []
  const distribution = data.distribution ?? {}

  return (
    <div className="space-y-6">
      {/* RFM Segments Table */}
      <div>
        <h3 className="mb-3 text-sm font-medium">
          {t('customers.rfm.segments')}
        </h3>
        {segments.length > 0 ? (
          <RfmSegmentsTable segments={segments} />
        ) : (
          <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border">
            {t('customers.rfm.noData')}
          </div>
        )}
      </div>

      {/* RFM Distribution */}
      <div>
        <h3 className="mb-3 text-sm font-medium">
          {t('customers.rfm.distribution')}
        </h3>
        <RfmDistribution distribution={distribution} />
      </div>
    </div>
  )
}

// ============================================
// COHORT ANALYSIS TAB
// ============================================

function CohortAnalysisTab() {
  const { t } = useTranslation('analytics')
  const { data, isLoading, error, refetch } = useCohortAnalysis({
    months: 6,
  })

  if (isLoading) return <CohortSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  const cohorts = data.cohorts ?? []
  const avgRetention = data.avgRetention ?? {}

  return (
    <div className="space-y-6">
      {/* Cohort Grid */}
      <div>
        <h3 className="mb-3 text-sm font-medium">
          {t('customers.cohorts.retention')}
        </h3>
        {cohorts.length > 0 ? (
          <CohortGrid cohorts={cohorts} />
        ) : (
          <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border">
            {t('customers.cohorts.noData')}
          </div>
        )}
      </div>

      {/* Average Retention */}
      <div>
        <h3 className="mb-3 text-sm font-medium">
          {t('customers.cohorts.avgRetention')}
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label={t('customers.cohorts.period1')}
            value={`${(avgRetention.period1 ?? 0).toFixed(1)}%`}
          />
          <MetricCard
            label={t('customers.cohorts.period3')}
            value={`${(avgRetention.period3 ?? 0).toFixed(1)}%`}
          />
          <MetricCard
            label={t('customers.cohorts.period6')}
            value={`${(avgRetention.period6 ?? 0).toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  )
}

// ============================================
// METRIC CARD
// ============================================

interface IMetricCardProps {
  label: string
  value: string | number
}

function MetricCard({ label, value }: IMetricCardProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-muted-foreground text-sm">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
      </div>
    </div>
  )
}

// ============================================
// SEGMENTS TABLE
// ============================================

interface ISegmentsTableProps {
  segments: ICustomerOverviewData['segments']
}

function SegmentsTable({ segments }: ISegmentsTableProps) {
  const { t } = useTranslation('analytics')
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('customers.table.segment')}</TableHead>
            <TableHead className="text-right">
              {t('customers.table.count')}
            </TableHead>
            <TableHead className="text-right">
              {t('customers.table.share')}
            </TableHead>
            <TableHead className="text-right">
              {t('customers.table.revenue')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment.segment}>
              <TableCell className="font-medium">
                {segment.segmentLabel ?? segment.segment}
              </TableCell>
              <TableCell className="text-right">
                {(segment.count ?? 0).toLocaleString('ru-RU')}
              </TableCell>
              <TableCell className="text-right">
                {segment.share ?? 0}%
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatPrice(segment.revenue ?? 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// RFM SEGMENTS TABLE
// ============================================

interface IRfmSegmentsTableProps {
  segments: IRfmAnalysisData['segments']
}

function RfmSegmentsTable({ segments }: IRfmSegmentsTableProps) {
  const { t } = useTranslation('analytics')
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('customers.table.rfmSegment')}</TableHead>
            <TableHead className="text-right">
              {t('customers.table.count')}
            </TableHead>
            <TableHead className="text-right">
              {t('customers.table.share')}
            </TableHead>
            <TableHead className="text-center">
              {t('customers.table.recency')}
            </TableHead>
            <TableHead className="text-center">
              {t('customers.table.frequency')}
            </TableHead>
            <TableHead className="text-center">
              {t('customers.table.monetary')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {segments.map((segment) => (
            <TableRow key={segment.segment}>
              <TableCell className="font-medium">
                {segment.segmentLabel}
              </TableCell>
              <TableCell className="text-right">
                {segment.count.toLocaleString('ru-RU')}
              </TableCell>
              <TableCell className="text-right">{segment.share}%</TableCell>
              <TableCell className="text-center">
                {(segment.avgR ?? 0).toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                {(segment.avgF ?? 0).toFixed(1)}
              </TableCell>
              <TableCell className="text-center">
                {(segment.avgM ?? 0).toFixed(1)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// ============================================
// RFM DISTRIBUTION
// ============================================

interface IRfmDistributionProps {
  distribution: IRfmAnalysisData['distribution']
}

function RfmDistribution({ distribution }: IRfmDistributionProps) {
  const metrics = [
    { label: 'Recency', values: distribution.recency ?? distribution.r ?? [] },
    {
      label: 'Frequency',
      values: distribution.frequency ?? distribution.f ?? [],
    },
    {
      label: 'Monetary',
      values: distribution.monetary ?? distribution.m ?? [],
    },
  ]

  return (
    <div className="space-y-4">
      {metrics.map(({ label, values }) => (
        <div key={label} className="flex items-center gap-4">
          <span className="w-24 text-sm">{label}</span>
          <div className="flex flex-1 gap-1">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-primary/20 h-6 flex-1 rounded"
                style={{ opacity: 0.2 + (value / 100) * 0.8 }}
                title={`Score ${i + 1}: ${value}%`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// COHORT GRID
// ============================================

interface ICohortGridProps {
  cohorts: ICohortAnalysisData['cohorts']
}

function CohortGrid({ cohorts }: ICohortGridProps) {
  const { t } = useTranslation('analytics')
  if (!cohorts || cohorts.length === 0) {
    return (
      <div className="text-muted-foreground flex h-32 items-center justify-center rounded-lg border">
        {t('customers.cohorts.noData')}
      </div>
    )
  }

  const maxPeriods = Math.max(
    ...cohorts.map((c) => (c.retention ?? []).length),
    0
  )

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('customers.table.cohort')}</TableHead>
            <TableHead className="text-right">
              {t('customers.table.size')}
            </TableHead>
            {Array.from({ length: maxPeriods }).map((_, i) => (
              <TableHead key={i} className="text-center">
                M{i}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cohorts.map((cohort) => {
            const retention = cohort.retention ?? []
            return (
              <TableRow key={cohort.cohortDate}>
                <TableCell className="font-medium">
                  {cohort.cohortLabel ?? cohort.cohortDate}
                </TableCell>
                <TableCell className="text-right">
                  {cohort.initialSize ?? 0}
                </TableCell>
                {retention.map((ret, i) => (
                  <TableCell key={i} className="text-center">
                    <span
                      className={cn(
                        'inline-block rounded px-2 py-0.5 text-sm',
                        getRetentionColor(ret.retentionRate ?? 0)
                      )}
                    >
                      {ret.retentionRate ?? 0}%
                    </span>
                  </TableCell>
                ))}
                {/* Fill empty cells */}
                {Array.from({ length: maxPeriods - retention.length }).map(
                  (_, i) => (
                    <TableCell
                      key={`empty-${i}`}
                      className="text-muted-foreground text-center"
                    >
                      -
                    </TableCell>
                  )
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function getRetentionColor(rate: number): string {
  if (rate >= COHORT_RETENTION_COLORS.high.min)
    return COHORT_RETENTION_COLORS.high.color
  if (rate >= COHORT_RETENTION_COLORS.medium.min)
    return COHORT_RETENTION_COLORS.medium.color
  if (rate >= COHORT_RETENTION_COLORS.low.min)
    return COHORT_RETENTION_COLORS.low.color
  return COHORT_RETENTION_COLORS.veryLow.color
}

// ============================================
// SKELETONS
// ============================================

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

function RfmSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 rounded-lg" />
      <Skeleton className="h-32 rounded-lg" />
    </div>
  )
}

function CohortSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-64 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
