'use client'

import { useMemo } from 'react'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/ui/base/chart'

import type {
  WidgetConfig,
  WidgetData,
} from '@/entities/dashboard/dashboard-widget'
import type { ChartConfig } from '@/shared/ui/base/chart'

interface BarChartWidgetProps {
  data: WidgetData
  config: WidgetConfig
}

export function BarChartWidget({ data, config }: BarChartWidgetProps) {
  const chartData = useMemo(() => {
    return (data.chartData ?? []).map((item) => ({
      label: item.label,
      value: item.value,
    }))
  }, [data.chartData])

  const chartConfig: ChartConfig = useMemo(
    () => ({
      value: {
        label: config.name,
        color: config.chartColor ?? '#8b5cf6',
      },
    }),
    [config.name, config.chartColor]
  )

  if (chartData.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Нет данных
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={10}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={10}
          tickFormatter={(value: number) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
            return value.toString()
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
