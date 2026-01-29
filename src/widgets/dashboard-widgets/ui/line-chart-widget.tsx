'use client'

import { useMemo } from 'react'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

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

interface LineChartWidgetProps {
  data: WidgetData
  config: WidgetConfig
}

export function LineChartWidget({ data, config }: LineChartWidgetProps) {
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
        color: config.chartColor ?? 'var(--primary)',
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
      <AreaChart
        data={chartData}
        margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
      >
        <defs>
          <linearGradient id={`fill-${config.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-value)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
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
          content={<ChartTooltipContent indicator="line" />}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--color-value)"
          fill={`url(#fill-${config.id})`}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
