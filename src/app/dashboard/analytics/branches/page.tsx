/**
 * Branches Analytics Page
 * Based on docs: 25-analytics-pages.md - Part 9: Branch Analytics
 *
 * ULTRA tier - Requires analytics_full entitlement
 * Shows branch comparison and benchmarking
 */

'use client'

import * as React from 'react'

import { IconArrowDown, IconArrowUp, IconMinus } from '@tabler/icons-react'

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
  useBranchComparison,
  useBranchBenchmark,
  AnalyticsPageLayout,
  AnalyticsErrorState,
} from '@/features/analytics'


// ============================================
// TYPES
// ============================================

type SortColumn = 'name' | 'revenue' | 'orders' | 'avgCheck' | 'vsAvg'
type SortDirection = 'asc' | 'desc'

// ============================================
// MAIN COMPONENT
// ============================================

export default function BranchesAnalyticsPage() {
  const [period, setPeriod] = React.useState<PeriodType>(PeriodType.THIS_WEEK)
  const [activeTab, setActiveTab] = React.useState('comparison')

  const handleExport = () => {
    // TODO: Implement export
    console.log('Export branches analytics')
  }

  return (
    <AnalyticsPageLayout
      pageCode="branches"
      title="Филиалы"
      period={period}
      onPeriodChange={setPeriod}
      onExport={handleExport}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="comparison">Сравнение</TabsTrigger>
          <TabsTrigger value="benchmark">Бенчмарк</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="mt-4">
          <BranchComparisonTab period={period} />
        </TabsContent>

        <TabsContent value="benchmark" className="mt-4">
          <BranchBenchmarkTab period={period} />
        </TabsContent>
      </Tabs>
    </AnalyticsPageLayout>
  )
}

// ============================================
// BRANCH COMPARISON TAB
// ============================================

interface IBranchComparisonTabProps {
  period: PeriodType
}

function BranchComparisonTab({ period }: IBranchComparisonTabProps) {
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('revenue')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')

  const { data, isLoading, error, refetch } = useBranchComparison({
    period: { type: period },
    sortBy: 'revenue',
  })

  // Extract branches array with defensive checks
  const branches = data?.branches ?? []
  const networkAvg = data?.networkAvg ?? { revenue: 0, orders: 0, avgCheck: 0 }

  // Sort branches
  const sortedBranches = React.useMemo(() => {
    if (branches.length === 0) return []

    const sorted = [...branches]

    sorted.sort((a, b) => {
      let aValue: string | number = a[sortColumn] ?? 0
      let bValue: string | number = b[sortColumn] ?? 0

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }, [branches, sortColumn, sortDirection])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  if (isLoading) return <ComparisonSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Network Average Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Средняя выручка" value={formatPrice(networkAvg.revenue ?? 0)} />
        <MetricCard label="Средние заказы" value={networkAvg.orders ?? 0} />
        <MetricCard label="Средний чек" value={formatPrice(networkAvg.avgCheck ?? 0)} />
      </div>

      {/* Comparison Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                column="name"
                label="Филиал"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
              <SortableHeader
                column="revenue"
                label="Выручка"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-right"
              />
              <SortableHeader
                column="orders"
                label="Заказов"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-right"
              />
              <SortableHeader
                column="avgCheck"
                label="Ср. чек"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-right"
              />
              <SortableHeader
                column="vsAvg"
                label="vs Среднее"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                className="text-right"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBranches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.name ?? 'N/A'}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatPrice(branch.revenue ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  {(branch.orders ?? 0).toLocaleString('ru-RU')}
                </TableCell>
                <TableCell className="text-right">
                  {formatPrice(branch.avgCheck ?? 0)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeIndicator value={branch.vsAvg ?? 0} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// ============================================
// BRANCH BENCHMARK TAB
// ============================================

interface IBranchBenchmarkTabProps {
  period: PeriodType
}

function BranchBenchmarkTab({ period }: IBranchBenchmarkTabProps) {
  const { data, isLoading, error, refetch } = useBranchBenchmark({
    period: { type: period },
  })

  if (isLoading) return <BenchmarkSkeleton />
  if (error) return <AnalyticsErrorState onRetry={() => refetch()} />
  if (!data) return null

  // Extract branches with defensive check
  const branches = data.branches ?? []

  const metrics = ['revenue', 'orders', 'avgCheck', 'customerCount', 'retentionRate'] as const
  const metricLabels: Record<string, string> = {
    revenue: 'Выручка',
    orders: 'Заказы',
    avgCheck: 'Ср. чек',
    customerCount: 'Клиенты',
    retentionRate: 'Удержание',
  }

  // Format metric value based on type
  const formatMetricValue = (metric: string, value: number | undefined): string => {
    const safeValue = value ?? 0
    if (metric === 'retentionRate') return `${safeValue.toFixed(1)}%`
    if (metric === 'revenue' || metric === 'avgCheck') return formatPrice(safeValue)
    return safeValue.toLocaleString('ru-RU')
  }

  if (branches.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border text-muted-foreground">
        Нет данных для сравнения филиалов
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Метрика</TableHead>
            {branches.map((branch) => (
              <TableHead key={branch.id} className="text-center">
                {branch.name ?? 'N/A'}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map((metric) => (
            <TableRow key={metric}>
              <TableCell className="font-medium">{metricLabels[metric]}</TableCell>
              {branches.map((branch) => (
                <TableCell key={branch.id} className="text-center font-medium">
                  {formatMetricValue(metric, branch.metrics?.[metric])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">
        {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
      </div>
    </div>
  )
}

// ============================================
// CHANGE INDICATOR
// ============================================

interface IChangeIndicatorProps {
  value: number
}

function ChangeIndicator({ value }: IChangeIndicatorProps) {
  const isPositive = value > 0
  const isNegative = value < 0

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1',
        isPositive && 'text-green-600 dark:text-green-500',
        isNegative && 'text-red-600 dark:text-red-500',
        !isPositive && !isNegative && 'text-muted-foreground'
      )}
    >
      {isPositive && <IconArrowUp className="size-3" />}
      {isNegative && <IconArrowDown className="size-3" />}
      {!isPositive && !isNegative && <IconMinus className="size-3" />}
      {value > 0 ? '+' : ''}
      {value.toFixed(1)}%
    </span>
  )
}

// ============================================
// SORTABLE HEADER
// ============================================

interface ISortableHeaderProps {
  column: SortColumn
  label: string
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
  className?: string
}

function SortableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: ISortableHeaderProps) {
  const isActive = sortColumn === column

  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/50', className)}
      onClick={() => onSort(column)}
    >
      <div className={cn('flex items-center gap-1', className?.includes('text-right') && 'justify-end')}>
        {label}
        {isActive && (
          sortDirection === 'asc' ? (
            <IconArrowUp className="size-3" />
          ) : (
            <IconArrowDown className="size-3" />
          )
        )}
      </div>
    </TableHead>
  )
}

// ============================================
// SKELETONS
// ============================================

function ComparisonSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-lg" />
    </div>
  )
}

function BenchmarkSkeleton() {
  return <Skeleton className="h-64 rounded-lg" />
}
