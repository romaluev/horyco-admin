'use client'

import { useMemo } from 'react'

import {
  IconCurrencyDollar,
  IconWallet,
  IconArrowUpRight,
} from '@tabler/icons-react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

import type { ITimeSeriesData } from '@/entities/dashboard/dashboard'

interface ITransactionsSummaryWidgetProps {
  data: ITimeSeriesData | null
  isLoading?: boolean
  onViewReport?: () => void
}

interface ISummaryCard {
  icon: typeof IconCurrencyDollar
  label: string
  sublabel: string
  value: number
  trend: 'up' | 'down'
  color: string
  bgColor: string
}

export function TransactionsSummaryWidget({
  data,
  isLoading = false,
  onViewReport,
}: ITransactionsSummaryWidgetProps) {
  const chartData = useMemo(() => {
    if (!data?.points) {
      return [
        { month: 'Янв', value: 38000 },
        { month: 'Фев', value: 52000 },
        { month: 'Мар', value: 32000 },
        { month: 'Апр', value: 12000 },
        { month: 'Май', value: 35000 },
        { month: 'Июн', value: 28000 },
        { month: 'Июл', value: 33000 },
        { month: 'Авг', value: 25000 },
      ]
    }
    return data.points.slice(0, 8).map((point) => ({
      month: point.label,
      value: point.value,
    }))
  }, [data])

  const totalValue = data?.totalValue ?? 243000
  const changePercent = data?.changePercent ?? 94.13

  const summaryCards: ISummaryCard[] = useMemo(
    () => [
      {
        icon: IconCurrencyDollar,
        label: 'Эта неделя',
        sublabel: '+82.46%',
        value: totalValue * 0.4,
        trend: 'up',
        color: 'text-red-500',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
      },
      {
        icon: IconWallet,
        label: 'Эта неделя',
        sublabel: '-24.8%',
        value: totalValue * 0.6,
        trend: 'down',
        color: 'text-emerald-500',
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      },
    ],
    [totalValue]
  )

  if (isLoading) {
    return <TransactionsSummaryWidgetSkeleton />
  }

  return (
    <div className="bg-card flex h-full flex-col rounded-xl border">
      <div className="grid flex-1 lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-r lg:border-b-0">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Транзакции</h3>
              <p className="text-muted-foreground text-sm">Обзор за неделю</p>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={24}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip
                  content={({ active, payload }) => {
                    const firstPayload = payload?.[0]
                    if (
                      active &&
                      firstPayload?.value !== undefined &&
                      firstPayload.value !== null
                    ) {
                      return (
                        <div className="bg-background rounded-lg border px-3 py-2 shadow-lg">
                          <p className="text-sm font-medium">
                            {formatPrice(Number(firstPayload.value))}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--chart-success))"
                  radius={[4, 4, 4, 4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col p-5 lg:w-56">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h4 className="font-semibold">Отчет</h4>
              <p className="text-muted-foreground text-sm">
                За месяц {formatPrice(totalValue / 10)}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            {summaryCards.map((card, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className={cn('rounded-lg p-2', card.bgColor)}>
                  <card.icon className={cn('size-4', card.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground text-xs">{card.label}</p>
                  <p
                    className={cn(
                      'text-lg font-bold',
                      card.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                    )}
                  >
                    {card.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                Эффективность
              </span>
              <span className="font-semibold text-emerald-600">
                +{changePercent.toFixed(2)}%
              </span>
            </div>
            <Button
              variant="outline"
              className="mt-3 w-full"
              onClick={onViewReport}
            >
              Смотреть отчет
              <IconArrowUpRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function TransactionsSummaryWidgetSkeleton() {
  return (
    <div className="bg-card flex h-full flex-col rounded-xl border">
      <div className="grid flex-1 lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-r lg:border-b-0">
          <div className="mb-4 space-y-2">
            <div className="bg-muted h-6 w-32 animate-pulse rounded" />
            <div className="bg-muted h-4 w-24 animate-pulse rounded" />
          </div>
          <div className="bg-muted h-[200px] animate-pulse rounded" />
        </div>
        <div className="flex flex-col p-5 lg:w-56">
          <div className="mb-4 space-y-2">
            <div className="bg-muted h-5 w-20 animate-pulse rounded" />
            <div className="bg-muted h-4 w-28 animate-pulse rounded" />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-muted h-16 animate-pulse rounded-lg" />
            ))}
          </div>
          <div className="mt-4 border-t pt-4">
            <div className="bg-muted h-8 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
