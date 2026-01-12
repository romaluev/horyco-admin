'use client'

import { useMemo } from 'react'

import {
  IconTrendingUp,
  IconTrendingDown,
  IconWallet,
  IconCreditCard,
  IconCash,
  IconArrowUpRight,
} from '@tabler/icons-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

import type { ITimeSeriesData } from '@/entities/dashboard'

interface IRevenueOverviewWidgetProps {
  data: ITimeSeriesData | null
  isLoading?: boolean
  onViewDetails?: () => void
}

interface IReportItem {
  icon: typeof IconWallet
  label: string
  value: number
  change: number
  color: string
  bgColor: string
}

export function RevenueOverviewWidget({
  data,
  isLoading = false,
  onViewDetails,
}: IRevenueOverviewWidgetProps) {
  const chartData = useMemo(() => {
    if (!data?.points) return []
    return data.points.map((point) => ({
      label: point.label,
      value: point.value,
    }))
  }, [data])

  const totalValue = data?.totalValue ?? 0
  const changePercent = data?.changePercent ?? 0
  const isPositive = changePercent >= 0

  const reportItems: IReportItem[] = useMemo(() => [
    {
      icon: IconWallet,
      label: 'Доход',
      value: totalValue * 0.85,
      change: 12.5,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      icon: IconCreditCard,
      label: 'Расходы',
      value: totalValue * 0.15,
      change: -8.2,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: IconCash,
      label: 'Прибыль',
      value: totalValue * 0.7,
      change: 15.3,
      color: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    },
  ], [totalValue])

  if (isLoading) {
    return <RevenueOverviewWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Обзор дохода</h3>
          <p className="text-sm text-muted-foreground">Еженедельный отчет</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewDetails}>
          Детали
          <IconArrowUpRight className="ml-1 size-4" />
        </Button>
      </div>

      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr,auto]">
        <div className="space-y-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(totalValue)}</span>
            <span
              className={cn(
                'flex items-center gap-0.5 text-sm font-medium',
                isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
              )}
            >
              {isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
              {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
            </span>
          </div>

          <div className="h-[120px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-success))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-success))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-success))"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:w-48">
          <h4 className="text-sm font-medium text-muted-foreground">Отчет</h4>
          {reportItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-lg border bg-background/50 p-3"
            >
              <div className={cn('rounded-lg p-2', item.bgColor)}>
                <item.icon className={cn('size-4', item.color)} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-semibold">{formatPrice(item.value)}</p>
              </div>
              <span
                className={cn(
                  'text-xs font-medium',
                  item.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                )}
              >
                {item.change >= 0 ? '+' : ''}{item.change}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RevenueOverviewWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid flex-1 gap-4 lg:grid-cols-[1fr,auto]">
        <div className="space-y-4">
          <div className="h-9 w-40 animate-pulse rounded bg-muted" />
          <div className="h-[120px] animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-col gap-3 lg:w-48">
          <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    </div>
  )
}
