'use client'

import { useMemo } from 'react'

import { IconAlertTriangle, IconArrowRight } from '@tabler/icons-react'
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis } from 'recharts'

import { Button } from '@/shared/ui/base/button'

interface IAnomalyDetectionWidgetProps {
  title?: string
  description?: string
  actualValue?: number
  predictionPercent?: number
  barData?: IAnomalyBar[]
  anomalyIndex?: number
  isLoading?: boolean
  onSeeDetails?: () => void
}

interface IAnomalyBar {
  value: number
  label?: string
}

const DEFAULT_BAR_DATA: IAnomalyBar[] = [
  { value: 30 },
  { value: 65 },
  { value: 50 },
  { value: 55 },
  { value: 95 },
  { value: 40 },
  { value: 35 },
  { value: 55 },
  { value: 65 },
  { value: 45 },
]

export function AnomalyDetectionWidget({
  title = 'Anomaly detected',
  description = 'Your product reach increasing beyond our predictions.',
  actualValue = 96.5,
  predictionPercent = 78,
  barData = DEFAULT_BAR_DATA,
  anomalyIndex = 4,
  isLoading = false,
  onSeeDetails,
}: IAnomalyDetectionWidgetProps) {
  const chartData = useMemo(() => {
    return barData.map((bar, index) => ({
      value: bar.value,
      isAnomaly: index === anomalyIndex,
      index,
    }))
  }, [barData, anomalyIndex])

  if (isLoading) {
    return <AnomalyDetectionWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
          <IconAlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
        </div>
      </div>

      <div className="mb-4 flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={16}>
            <XAxis dataKey="index" hide />
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isAnomaly
                      ? 'hsl(var(--foreground))'
                      : 'hsl(var(--muted))'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-end justify-between border-t pt-4">
        <div>
          <span className="text-4xl font-bold">{actualValue}%</span>
          <p className="text-sm text-muted-foreground">
            Prediction {predictionPercent}%
          </p>
        </div>
        <Button variant="outline" onClick={onSeeDetails}>
          See details
          <IconArrowRight className="ml-1 size-4" />
        </Button>
      </div>
    </div>
  )
}

function AnomalyDetectionWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1 space-y-1">
          <div className="h-6 w-36 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
        </div>
        <div className="size-9 animate-pulse rounded-lg bg-muted" />
      </div>
      <div className="mb-4 h-[140px] animate-pulse rounded bg-muted" />
      <div className="flex items-end justify-between border-t pt-4">
        <div className="space-y-1">
          <div className="h-10 w-20 animate-pulse rounded bg-muted" />
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-9 w-28 animate-pulse rounded bg-muted" />
      </div>
    </div>
  )
}
