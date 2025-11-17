/**
 * Dashboard Skeleton Loading State
 */

import { Card, CardContent, CardHeader } from '@/shared/ui/base/card'

const KpiCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
    </CardHeader>
    <CardContent>
      <div className="h-8 w-32 animate-pulse rounded bg-muted mb-2" />
      <div className="h-4 w-16 animate-pulse rounded bg-muted mb-1" />
      <div className="h-3 w-24 animate-pulse rounded bg-muted" />
    </CardContent>
  </Card>
)

const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          <div className="h-8 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="h-[400px] animate-pulse rounded bg-muted" />
    </CardContent>
  </Card>
)

const TableSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-5 w-48 animate-pulse rounded bg-muted" />
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-8 animate-pulse rounded bg-muted" />
            <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-4 w-20 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

export const DashboardSkeleton = () => {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          <div className="h-9 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-4">
          <div className="h-9 w-96 animate-pulse rounded bg-muted" />
          <div className="h-9 w-48 animate-pulse rounded bg-muted" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
        <KpiCardSkeleton />
      </div>

      {/* Chart Skeleton */}
      <ChartSkeleton />

      {/* Tables Skeleton */}
      <TableSkeleton />
      <TableSkeleton />
    </div>
  )
}
