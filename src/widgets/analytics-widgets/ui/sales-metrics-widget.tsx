'use client'

import { useMemo } from 'react'

import {
  IconTrendingUp,
  IconDiscount,
  IconCurrencyDollar,
  IconReceipt,
  IconChartBar,
  IconPercentage,
} from '@tabler/icons-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

interface ISalesMetricsWidgetProps {
  companyName?: string
  companyEmail?: string
  metrics?: IMetricItem[]
  goalProgress?: number
  totalProfit?: number
  salesPlanPercent?: number
  isLoading?: boolean
  onOpenStatistics?: () => void
  onPercentageChange?: () => void
}

interface IMetricItem {
  label: string
  value: number | string
  icon: typeof IconTrendingUp
  color: string
}

const DEFAULT_METRICS: IMetricItem[] = [
  {
    label: 'Тренд продаж',
    value: 11548000,
    icon: IconTrendingUp,
    color: 'text-muted-foreground',
  },
  {
    label: 'Скидки',
    value: 1326000,
    icon: IconDiscount,
    color: 'text-muted-foreground',
  },
  {
    label: 'Чистая прибыль',
    value: 17356000,
    icon: IconCurrencyDollar,
    color: 'text-muted-foreground',
  },
  {
    label: 'Всего заказов',
    value: 248,
    icon: IconReceipt,
    color: 'text-muted-foreground',
  },
]

export function SalesMetricsWidget({
  companyName = 'Моя компания',
  companyEmail = 'info@company.com',
  metrics = DEFAULT_METRICS,
  goalProgress = 56,
  totalProfit = 256.24,
  salesPlanPercent = 54,
  isLoading = false,
  onOpenStatistics,
  onPercentageChange,
}: ISalesMetricsWidgetProps) {
  const chartData = useMemo(
    () => [
      {
        name: 'completed',
        value: goalProgress,
        color: 'hsl(var(--foreground))',
      },
      {
        name: 'remaining',
        value: 100 - goalProgress,
        color: 'hsl(var(--muted))',
      },
    ],
    [goalProgress]
  )

  const cohortIndicators = useMemo(() => {
    const filled = Math.floor(salesPlanPercent / 5)
    const total = 20
    return Array.from({ length: total }, (_, i) => i < filled)
  }, [salesPlanPercent])

  if (isLoading) {
    return <SalesMetricsWidgetSkeleton />
  }

  return (
    <div className="bg-card flex h-full flex-col rounded-xl border">
      <div className="grid lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-r lg:border-b-0">
          <h3 className="mb-4 text-lg font-semibold">Sales metrics</h3>

          <div className="mb-6 flex items-center gap-3">
            <div className="bg-foreground flex size-10 items-center justify-center rounded-lg">
              <span className="text-background text-lg font-bold">*</span>
            </div>
            <div>
              <p className="font-medium">{companyName}</p>
              <p className="text-muted-foreground text-sm">{companyEmail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {metrics.map((metric, index) => {
              const MetricIcon = metric.icon
              return (
                <div key={index} className="rounded-lg border p-3">
                  <div className="mb-1 flex items-center gap-2">
                    <MetricIcon className={cn('size-4', metric.color)} />
                    <span className="text-muted-foreground text-xs">
                      {metric.label}
                    </span>
                  </div>
                  <p className="text-lg font-semibold">
                    {typeof metric.value === 'number' && metric.value > 1000
                      ? formatPrice(metric.value, { short: true })
                      : metric.value}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-5 lg:w-56">
          <h4 className="mb-2 font-semibold">Revenue goal</h4>
          <div className="relative size-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={55}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold">{totalProfit}</span>
              <span className="text-muted-foreground text-[10px]">
                Total Profit
              </span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Plan completed
            </span>
            <span className="text-lg font-bold">{goalProgress}%</span>
          </div>
        </div>
      </div>

      <div className="border-t p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h4 className="mb-1 font-semibold">Sales plan</h4>
            <span className="text-5xl font-bold">{salesPlanPercent}%</span>
            <p className="text-muted-foreground mt-1 text-sm">
              Percentage profit from total sales
            </p>
          </div>

          <div className="max-w-md flex-1">
            <h4 className="mb-2 font-semibold">Cohort analysis indicators</h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Analyzes the behaviour of a group of users who joined a
              product/service at the same time. over a certain period.
            </p>

            <div className="mb-4 flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onOpenStatistics}>
                <IconChartBar className="mr-1.5 size-4" />
                Open Statistics
              </Button>
              <Button variant="ghost" size="sm" onClick={onPercentageChange}>
                <IconPercentage className="mr-1.5 size-4" />
                Percentage Change
              </Button>
            </div>

            <div className="flex flex-wrap gap-1">
              {cohortIndicators.map((filled, index) => (
                <div
                  key={index}
                  className={cn(
                    'size-4 rounded-full',
                    filled ? 'bg-foreground' : 'bg-muted'
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SalesMetricsWidgetSkeleton() {
  return (
    <div className="bg-card flex h-full flex-col rounded-xl border">
      <div className="grid lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-r lg:border-b-0">
          <div className="bg-muted mb-4 h-6 w-28 animate-pulse rounded" />
          <div className="mb-6 flex items-center gap-3">
            <div className="bg-muted size-10 animate-pulse rounded-lg" />
            <div className="space-y-1">
              <div className="bg-muted h-5 w-32 animate-pulse rounded" />
              <div className="bg-muted h-4 w-40 animate-pulse rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-muted h-20 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-5 lg:w-56">
          <div className="bg-muted mb-2 h-5 w-24 animate-pulse rounded" />
          <div className="bg-muted size-32 animate-pulse rounded-full" />
          <div className="bg-muted mt-2 h-5 w-32 animate-pulse rounded" />
        </div>
      </div>
      <div className="border-t p-5">
        <div className="bg-muted h-32 animate-pulse rounded" />
      </div>
    </div>
  )
}
