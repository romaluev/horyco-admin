'use client'

import { useMemo } from 'react'

import {
  IconCurrencyDollar,
  IconWallet,
  IconCreditCard,
  IconArrowUpRight,
} from '@tabler/icons-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'

interface IIncomeExpenseWidgetProps {
  profitData?: IMonthlyProfit[]
  totalProfit?: number
  totalIncome?: number
  totalExpense?: number
  monthlyAverage?: number
  isLoading?: boolean
  onViewReport?: () => void
}

interface IMonthlyProfit {
  month: string
  profit: number
  income: number
  expense: number
}

const DEFAULT_DATA: IMonthlyProfit[] = [
  { month: 'Янв', profit: 20, income: 28, expense: 8 },
  { month: 'Фев', profit: 20, income: 35, expense: 15 },
  { month: 'Мар', profit: 18, income: 40, expense: 22 },
  { month: 'Апр', profit: 12, income: 25, expense: 13 },
  { month: 'Май', profit: 22, income: 45, expense: 23 },
  { month: 'Июн', profit: 22, income: 52, expense: 30 },
  { month: 'Июл', profit: 24, income: 45, expense: 21 },
]

export function IncomeExpenseWidget({
  profitData = DEFAULT_DATA,
  totalProfit = 48568200,
  totalIncome = 38453250,
  totalExpense = 2453450,
  monthlyAverage = 45578000,
  isLoading = false,
  onViewReport,
}: IIncomeExpenseWidgetProps) {
  const chartData = useMemo(() => {
    return profitData.map((item) => ({
      month: item.month,
      profit: item.profit,
      income: item.income,
      expense: item.expense,
    }))
  }, [profitData])

  if (isLoading) {
    return <IncomeExpenseWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="grid flex-1 lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Финансы</h3>
              <p className="text-sm text-muted-foreground">Годовой обзор</p>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barGap={2}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background px-3 py-2 shadow-lg">
                          <p className="mb-1 text-xs font-medium">{label}</p>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <div
                                className="size-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-muted-foreground">{entry.name}:</span>
                              <span className="font-medium">{entry.value}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar
                  name="Прибыль"
                  dataKey="profit"
                  stackId="a"
                  fill="hsl(var(--chart-success))"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  name="Доход"
                  dataKey="income"
                  stackId="a"
                  fill="hsl(var(--chart-info))"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  name="Расход"
                  dataKey="expense"
                  stackId="a"
                  fill="hsl(var(--chart-4))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col p-5 lg:w-56">
          <div className="mb-4">
            <h4 className="font-semibold">Отчет</h4>
            <p className="text-sm text-muted-foreground">
              Средн. {formatPrice(monthlyAverage, { short: true })}
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <ReportCard
              icon={IconCurrencyDollar}
              label="Общая прибыль"
              value={totalProfit}
              color="text-emerald-500"
              bgColor="bg-emerald-100 dark:bg-emerald-900/30"
            />
            <ReportCard
              icon={IconWallet}
              label="Общий доход"
              value={totalIncome}
              color="text-blue-500"
              bgColor="bg-blue-100 dark:bg-blue-900/30"
            />
            <ReportCard
              icon={IconCreditCard}
              label="Общий расход"
              value={totalExpense}
              color="text-violet-500"
              bgColor="bg-violet-100 dark:bg-violet-900/30"
            />
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={onViewReport}
          >
            Смотреть отчет
            <IconArrowUpRight className="ml-1 size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface IReportCardProps {
  icon: typeof IconCurrencyDollar
  label: string
  value: number
  color: string
  bgColor: string
}

function ReportCard({ icon, label, value, color, bgColor }: IReportCardProps) {
  const IconComponent = icon
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3">
      <div className={cn('rounded-lg p-2', bgColor)}>
        <IconComponent className={cn('size-4', color)} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{formatPrice(value)}</p>
      </div>
    </div>
  )
}

function IncomeExpenseWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card">
      <div className="grid flex-1 lg:grid-cols-[1fr,auto]">
        <div className="border-b p-5 lg:border-b-0 lg:border-r">
          <div className="mb-4 space-y-2">
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-[200px] animate-pulse rounded bg-muted" />
        </div>
        <div className="flex flex-col p-5 lg:w-56">
          <div className="mb-4 space-y-2">
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="flex flex-1 flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="mt-4 h-9 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  )
}
