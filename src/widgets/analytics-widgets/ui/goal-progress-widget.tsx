'use client'

import { CheckCircle2, AlertCircle, Clock } from 'lucide-react'

import { cn } from '@/shared/lib/utils'
import { Progress } from '@/shared/ui/base/progress'

import type {
  IGoalsSummary,
  IGoalProgress,
} from '@/entities/dashboard/dashboard'

interface GoalProgressWidgetProps {
  data: IGoalsSummary | null
  isLoading?: boolean
  className?: string
}

const STATUS_CONFIG: Record<
  IGoalProgress['status'],
  {
    icon: typeof CheckCircle2
    className: string
    label: string
  }
> = {
  ON_TRACK: {
    icon: CheckCircle2,
    className: 'text-green-600',
    label: 'В плане',
  },
  AT_RISK: {
    icon: Clock,
    className: 'text-yellow-600',
    label: 'Под угрозой',
  },
  BEHIND: {
    icon: AlertCircle,
    className: 'text-destructive',
    label: 'Отстает',
  },
}

export function GoalProgressWidget({
  data,
  isLoading = false,
  className,
}: GoalProgressWidgetProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-4', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="bg-muted h-4 w-32 animate-pulse rounded" />
              <div className="bg-muted h-4 w-12 animate-pulse rounded" />
            </div>
            <div className="bg-muted h-2 w-full animate-pulse rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!data || data.goals.length === 0) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
        Нет активных целей
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Выполнено</span>
        <span className="font-medium">
          {data.completedCount} / {data.totalCount}
        </span>
      </div>

      {/* Goals list */}
      <div className="space-y-4">
        {data.goals.map((goal) => {
          const config = STATUS_CONFIG[goal.status]
          const Icon = config.icon

          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Icon className={cn('h-4 w-4 shrink-0', config.className)} />
                  <span className="truncate text-sm font-medium">
                    {goal.name}
                  </span>
                </div>
                <span className="shrink-0 text-sm tabular-nums">
                  {goal.percentage.toFixed(0)}%
                </span>
              </div>

              <Progress value={goal.percentage} className="h-2" />

              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>
                  {goal.current.toLocaleString('ru-RU')} /{' '}
                  {goal.target.toLocaleString('ru-RU')}
                </span>
                <span className={config.className}>{config.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
