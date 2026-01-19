'use client'

import { useMemo } from 'react'

import { Cell, Pie, PieChart } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/base/chart'

import type { WidgetConfig, WidgetData } from '@/entities/dashboard/dashboard-widget'
import type { ChartConfig } from '@/shared/ui/base/chart'

interface PieChartWidgetProps {
  data: WidgetData
  config: WidgetConfig
}

const COLORS = [
  'hsl(var(--primary))',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#6366f1',
  '#f43f5e',
]

export function PieChartWidget({ data, config }: PieChartWidgetProps) {
  const chartData = useMemo(() => {
    return (data.chartData ?? []).slice(0, config.limit ?? 5).map((item, i) => ({
      name: item.label,
      value: item.value,
      fill: COLORS[i % COLORS.length],
    }))
  }, [data.chartData, config.limit])

  const chartConfig: ChartConfig = useMemo(() => {
    return chartData.reduce(
      (acc, item, i) => ({
        ...acc,
        [item.name]: {
          label: item.name,
          color: COLORS[i % COLORS.length],
        },
      }),
      {} as ChartConfig
    )
  }, [chartData])

  if (chartData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Нет данных
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
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
          innerRadius="40%"
          outerRadius="70%"
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          verticalAlign="bottom"
        />
      </PieChart>
    </ChartContainer>
  )
}
