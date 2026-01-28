'use client'

import { useMemo } from 'react'

import { Cell, Pie, PieChart } from 'recharts'

import { cn } from '@/shared/lib/utils'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/base/chart'

import type { IProportionsData } from '@/entities/dashboard/dashboard'
import type { ChartConfig } from '@/shared/ui/base/chart'

interface ChannelSplitWidgetProps {
  data: IProportionsData | null
  isLoading?: boolean
  className?: string
}

const CHANNEL_COLORS: Record<string, string> = {
  DINE_IN: 'hsl(var(--chart-1))',
  TAKEAWAY: 'hsl(var(--chart-2))',
  DELIVERY: 'hsl(var(--chart-3))',
  DRIVE_THRU: 'hsl(var(--chart-4))',
  ONLINE: 'hsl(var(--chart-5))',
}

const FALLBACK_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function ChannelSplitWidget({
  data,
  isLoading = false,
  className,
}: ChannelSplitWidgetProps) {
  const chartData = useMemo(() => {
    if (!data?.segments) return []
    return data.segments.map((segment, index) => ({
      name: segment.label,
      value: segment.value,
      percentage: segment.percentage,
      fill: segment.color || CHANNEL_COLORS[segment.key] || FALLBACK_COLORS[index % FALLBACK_COLORS.length],
    }))
  }, [data])

  const chartConfig = useMemo<ChartConfig>(() => {
    return chartData.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: {
          label: item.name,
          color: item.fill,
        },
      }),
      {} as ChartConfig
    )
  }, [chartData])

  if (isLoading) {
    return (
      <div className={cn('flex h-full items-center justify-center', className)}>
        <div className="h-32 w-32 animate-pulse rounded-full bg-muted" />
      </div>
    )
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Нет данных
      </div>
    )
  }

  return (
    <div className={cn('flex h-full flex-col gap-4', className)}>
      {/* Pie Chart */}
      <div className="flex-1 min-h-[120px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="85%"
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>

      {/* Legend */}
      <div className="space-y-1">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
            <span className="font-medium tabular-nums">
              {item.percentage.toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
