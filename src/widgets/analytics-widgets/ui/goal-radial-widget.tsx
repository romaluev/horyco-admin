'use client'

import { useMemo } from 'react'

import {
  IconTarget,
  IconTrendingUp,
  IconCheck,
  IconClock,
} from '@tabler/icons-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { formatPrice } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'

interface IGoalRadialWidgetProps {
  goals?: IGoalItem[]
  overallProgress?: number
  isLoading?: boolean
}

interface IGoalItem {
  label: string
  current: number
  target: number
  color: string
  status: 'on_track' | 'ahead' | 'behind'
}

const DEFAULT_GOALS: IGoalItem[] = [
  { label: 'Выручка', current: 45000000, target: 50000000, color: '#22c55e', status: 'on_track' },
  { label: 'Заказы', current: 1250, target: 1500, color: '#3b82f6', status: 'ahead' },
  { label: 'Клиенты', current: 320, target: 400, color: '#f59e0b', status: 'behind' },
]

const STATUS_CONFIG = {
  on_track: { icon: IconClock, label: 'По плану', className: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  ahead: { icon: IconTrendingUp, label: 'Опережаем', className: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  behind: { icon: IconTarget, label: 'Отстаём', className: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
}

export function GoalRadialWidget({
  goals = DEFAULT_GOALS,
  overallProgress = 78,
  isLoading = false,
}: IGoalRadialWidgetProps) {
  const chartData = useMemo(() => [
    { name: 'completed', value: overallProgress, color: 'hsl(var(--primary))' },
    { name: 'remaining', value: 100 - overallProgress, color: 'hsl(var(--muted))' },
  ], [overallProgress])

  if (isLoading) {
    return <GoalRadialWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Goal Progress</h3>
        <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
          <IconCheck className="size-3" />
          {overallProgress}% Complete
        </div>
      </div>

      <div className="mb-6 flex items-center justify-center">
        <div className="relative size-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
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
            <IconTarget className="mb-1 size-6 text-primary" />
            <span className="text-2xl font-bold">{overallProgress}%</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        {goals.map((goal, index) => {
          const progressPercent = Math.min((goal.current / goal.target) * 100, 100)
          const statusConfig = STATUS_CONFIG[goal.status]
          const StatusIcon = statusConfig.icon

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{goal.label}</span>
                <div className={cn('flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', statusConfig.className)}>
                  <StatusIcon className="size-3" />
                  {statusConfig.label}
                </div>
              </div>

              <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: goal.color,
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {goal.current >= 1000000
                    ? formatPrice(goal.current, { short: true, currency: false })
                    : goal.current.toLocaleString('ru-RU')}
                </span>
                <span>
                  Target:{' '}
                  {goal.target >= 1000000
                    ? formatPrice(goal.target, { short: true, currency: false })
                    : goal.target.toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function GoalRadialWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="mb-6 flex items-center justify-center">
        <div className="size-36 animate-pulse rounded-full bg-muted" />
      </div>
      <div className="flex-1 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-2 animate-pulse rounded-full bg-muted" />
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
