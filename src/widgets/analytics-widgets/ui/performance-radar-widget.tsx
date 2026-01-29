'use client'

import { useMemo } from 'react'

import { IconTrendingUp, IconTrendingDown } from '@tabler/icons-react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

import { cn } from '@/shared/lib/utils'

interface IPerformanceRadarWidgetProps {
  metrics?: IPerformanceMetric[]
  overallScore?: number
  previousScore?: number
  isLoading?: boolean
}

interface IPerformanceMetric {
  name: string
  value: number
  maxValue?: number
}

const DEFAULT_METRICS: IPerformanceMetric[] = [
  { name: 'Выручка', value: 85, maxValue: 100 },
  { name: 'Заказы', value: 72, maxValue: 100 },
  { name: 'Клиенты', value: 90, maxValue: 100 },
  { name: 'Средний чек', value: 65, maxValue: 100 },
  { name: 'Возвраты', value: 45, maxValue: 100 },
  { name: 'Удержание', value: 78, maxValue: 100 },
]

export function PerformanceRadarWidget({
  metrics = DEFAULT_METRICS,
  overallScore = 72,
  previousScore = 68,
  isLoading = false,
}: IPerformanceRadarWidgetProps) {
  const chartData = useMemo(() => {
    return metrics.map((metric) => ({
      subject: metric.name,
      value: metric.value,
      fullMark: metric.maxValue ?? 100,
    }))
  }, [metrics])

  const scoreDiff = overallScore - previousScore
  const isPositive = scoreDiff >= 0

  if (isLoading) {
    return <PerformanceRadarWidgetSkeleton />
  }

  return (
    <div className="bg-card flex h-full flex-col rounded-xl border p-5">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Эффективность</h3>
        <p className="text-muted-foreground text-sm">
          Анализ ключевых показателей
        </p>
      </div>

      <div className="min-h-[200px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Текущий"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center justify-between border-t pt-3">
        <div>
          <p className="text-muted-foreground text-sm">Общий балл</p>
          <p className="text-2xl font-bold">{overallScore}%</p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 rounded-full px-3 py-1',
            isPositive
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isPositive ? (
            <IconTrendingUp className="size-4" />
          ) : (
            <IconTrendingDown className="size-4" />
          )}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}
            {scoreDiff} vs пред. период
          </span>
        </div>
      </div>
    </div>
  )
}

function PerformanceRadarWidgetSkeleton() {
  return (
    <div className="bg-card flex h-full flex-col rounded-xl border p-5">
      <div className="mb-2 space-y-2">
        <div className="bg-muted h-6 w-32 animate-pulse rounded" />
        <div className="bg-muted h-4 w-48 animate-pulse rounded" />
      </div>
      <div className="bg-muted min-h-[200px] flex-1 animate-pulse rounded" />
      <div className="mt-2 flex items-center justify-between border-t pt-3">
        <div className="space-y-1">
          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
          <div className="bg-muted h-8 w-16 animate-pulse rounded" />
        </div>
        <div className="bg-muted h-8 w-32 animate-pulse rounded-full" />
      </div>
    </div>
  )
}
