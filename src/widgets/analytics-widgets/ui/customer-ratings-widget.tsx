'use client'

import { useMemo } from 'react'

import { IconStar, IconStarFilled, IconStarHalfFilled, IconDotsVertical } from '@tabler/icons-react'
import { Line, LineChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'

interface ICustomerRatingsWidgetProps {
  rating?: number
  maxRating?: number
  changePoints?: number
  comparisonLabel?: string
  chartData?: IRatingChartPoint[]
  isLoading?: boolean
  onViewDetails?: () => void
}

interface IRatingChartPoint {
  month: string
  current: number
  previous: number
}

const DEFAULT_CHART_DATA: IRatingChartPoint[] = [
  { month: 'Jan', current: 3.2, previous: 3.5 },
  { month: 'Feb', current: 3.8, previous: 3.4 },
  { month: 'Mar', current: 4.2, previous: 4.0 },
  { month: 'Apr', current: 4.5, previous: 4.2 },
  { month: 'May', current: 4.0, previous: 4.3 },
  { month: 'Jun', current: 3.5, previous: 3.8 },
  { month: 'Jul', current: 4.5, previous: 4.0 },
]

function StarRating({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) {
  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  for (let i = 0; i < maxRating; i++) {
    if (i < fullStars) {
      stars.push(
        <IconStarFilled
          key={i}
          className="size-5 text-amber-500"
        />
      )
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <IconStarHalfFilled
          key={i}
          className="size-5 text-amber-500"
        />
      )
    } else {
      stars.push(
        <IconStar
          key={i}
          className="size-5 text-amber-200"
        />
      )
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>
}

export function CustomerRatingsWidget({
  rating = 4.5,
  maxRating = 5,
  changePoints = 5.0,
  comparisonLabel = 'За прошлый месяц',
  chartData = DEFAULT_CHART_DATA,
  isLoading = false,
  onViewDetails,
}: ICustomerRatingsWidgetProps) {
  const isPositive = changePoints >= 0

  const formattedChartData = useMemo(() => {
    return chartData.map((point) => ({
      ...point,
      currentScaled: point.current,
      previousScaled: point.previous,
    }))
  }, [chartData])

  if (isLoading) {
    return <CustomerRatingsWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-semibold">Customer Ratings</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-4xl font-bold">{rating.toFixed(1)}</span>
        <StarRating rating={rating} maxRating={maxRating} />
      </div>

      <div className="mb-6 flex items-center gap-2">
        <span
          className={cn(
            'rounded-md px-2 py-1 text-sm font-medium',
            isPositive
              ? 'bg-muted text-foreground'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          )}
        >
          {isPositive ? '+' : ''}{changePoints.toFixed(1)}
        </span>
        <span className="text-sm text-muted-foreground">{comparisonLabel}</span>
      </div>

      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedChartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
                      <p className="mb-1 text-xs font-medium">{label}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-muted-foreground">
                            {entry.dataKey === 'currentScaled' ? 'Current' : 'Previous'}:
                          </span>
                          <span className="font-medium">{Number(entry.value).toFixed(1)}</span>
                        </div>
                      ))}
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="previousScaled"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="currentScaled"
              stroke="hsl(var(--chart-success))"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 6,
                fill: 'hsl(var(--chart-success))',
                stroke: 'hsl(var(--background))',
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function CustomerRatingsWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-6 w-36 animate-pulse rounded bg-muted" />
        <div className="size-8 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div className="h-10 w-16 animate-pulse rounded bg-muted" />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="size-5 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
      <div className="mb-6 flex items-center gap-2">
        <div className="h-7 w-14 animate-pulse rounded bg-muted" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-[140px] animate-pulse rounded bg-muted" />
    </div>
  )
}
