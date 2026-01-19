'use client'

import { KpiType } from '@/shared/api/graphql'

import type { IKpiMetricValue } from '@/entities/dashboard/dashboard'

import { KpiCardSparkline, KpiCardSparklineSkeleton } from './kpi-card-sparkline'

interface IDashboardKpiCardsProps {
  metrics: IKpiMetricValue[]
  kpiTypes: KpiType[]
  isLoading?: boolean
}

export function DashboardKpiCards({
  metrics,
  kpiTypes,
  isLoading = false,
}: IDashboardKpiCardsProps) {
  const metricsMap = new Map(metrics.map((m) => [m.type, m]))

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiTypes.map((type) => (
          <KpiCardSparklineSkeleton key={type} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpiTypes.map((type) => {
        const metric = metricsMap.get(type)

        if (!metric) {
          return <KpiCardSparklineSkeleton key={type} />
        }

        return <KpiCardSparkline key={type} metric={metric} />
      })}
    </div>
  )
}
