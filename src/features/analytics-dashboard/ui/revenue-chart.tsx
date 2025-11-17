/**
 * Revenue Chart Component
 * Line chart displaying revenue trend with groupBy controls
 */

'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Button } from '@/shared/ui/base/button'
import { cn } from '@/shared/lib/utils'
import { formatCurrency, formatChartLabel } from '../lib/utils'

import type { IAnalyticsChart, AnalyticsGroupBy } from '@/entities/analytics'

interface IRevenueChartProps {
  chart: IAnalyticsChart
  currentGroupBy?: AnalyticsGroupBy
  onGroupByChange: (groupBy: AnalyticsGroupBy) => void
}

export const RevenueChart = ({
  chart,
  currentGroupBy,
  onGroupByChange,
}: IRevenueChartProps) => {
  const groupByOptions: AnalyticsGroupBy[] = ['hour', 'day', 'week']

  // Transform chart data for Recharts
  const chartData = chart.points.map((point) => ({
    label: formatChartLabel(point.timestamp, chart.groupBy),
    revenue: point.revenue,
    orders: point.orders,
    timestamp: point.timestamp,
  }))

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean
    payload?: Array<{
      payload: { revenue: number; orders: number; label: string }
    }>
  }) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]
    if (!data) return null

    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="text-sm font-medium">{data.payload.label}</p>
        <p className="text-sm text-muted-foreground">
          Revenue: {formatCurrency(data.payload.revenue)} som
        </p>
        <p className="text-sm text-muted-foreground">
          Orders: {data.payload.orders}
        </p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Revenue Trend</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Group by:</span>
            {groupByOptions.map((option) => (
              <Button
                key={option}
                variant={
                  (currentGroupBy || chart.groupBy) === option
                    ? 'default'
                    : 'outline'
                }
                size="sm"
                onClick={() => onGroupByChange(option)}
                className="capitalize"
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="label"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value: number) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
                  return value.toString()
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="Revenue (som)"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm text-muted-foreground">
                No data available
              </p>
              <p className="text-xs text-muted-foreground">for this period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
