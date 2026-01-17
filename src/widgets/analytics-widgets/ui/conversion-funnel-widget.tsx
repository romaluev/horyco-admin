'use client'

import { useMemo } from 'react'

import {
  IconTrendingUp,
  IconTrendingDown,
  IconDotsVertical,
  IconEye,
  IconShoppingCart,
  IconCreditCard,
  IconPackage,
} from '@tabler/icons-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'

import { cn } from '@/shared/lib/utils'
import { Button } from '@/shared/ui/base/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/ui/base/dropdown-menu'

interface IConversionFunnelWidgetProps {
  conversionRate?: number
  changePercent?: number
  comparisonLabel?: string
  steps?: IFunnelStep[]
  sparklineData?: number[]
  isLoading?: boolean
  onViewDetails?: () => void
}

interface IFunnelStep {
  label: string
  sublabel: string
  value: string
  changePercent: number
  icon: typeof IconEye
}

const DEFAULT_STEPS: IFunnelStep[] = [
  {
    label: 'Просмотры',
    sublabel: '12.2K посещений',
    value: '12.2K',
    changePercent: 20.3,
    icon: IconEye,
  },
  {
    label: 'В корзине',
    sublabel: '32 товара в корзине',
    value: '32',
    changePercent: 6.3,
    icon: IconShoppingCart,
  },
  {
    label: 'Оформление',
    sublabel: '15 оформлено',
    value: '15',
    changePercent: -9.56,
    icon: IconCreditCard,
  },
  {
    label: 'Покупки',
    sublabel: '12 заказов',
    value: '12',
    changePercent: 2.62,
    icon: IconPackage,
  },
]

const DEFAULT_SPARKLINE = [30, 45, 35, 50, 65, 55, 70, 60, 75, 80, 70, 85]

export function ConversionFunnelWidget({
  conversionRate = 92.8,
  changePercent = 6.3,
  comparisonLabel = 'По сравнению с прошлым месяцем',
  steps = DEFAULT_STEPS,
  sparklineData = DEFAULT_SPARKLINE,
  isLoading = false,
  onViewDetails,
}: IConversionFunnelWidgetProps) {
  const isPositive = changePercent >= 0

  const chartData = useMemo(() => {
    return sparklineData.map((value, index) => ({ value, index }))
  }, [sparklineData])

  if (isLoading) {
    return <ConversionFunnelWidgetSkeleton />
  }

  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Conversion rate</h3>
          <p className="text-sm text-muted-foreground">{comparisonLabel}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <IconDotsVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-4xl font-bold">{conversionRate}%</span>
          <span
            className={cn(
              'flex items-center gap-0.5 text-sm font-medium',
              isPositive ? 'text-emerald-600' : 'text-red-600'
            )}
          >
            {isPositive ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
            {changePercent > 0 ? '+' : ''}{changePercent}%
          </span>
        </div>
        <div className="h-12 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="conversionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-success))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--chart-success))"
                strokeWidth={2}
                fill="url(#conversionGradient)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex-1 space-y-3">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const stepPositive = step.changePercent >= 0
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <StepIcon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {stepPositive ? (
                  <IconTrendingUp className="size-4 text-emerald-600" />
                ) : (
                  <IconTrendingDown className="size-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'text-sm font-medium',
                    stepPositive ? 'text-emerald-600' : 'text-red-600'
                  )}
                >
                  {step.changePercent > 0 ? '+' : ''}{step.changePercent}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ConversionFunnelWidgetSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border bg-card p-5">
      <div className="mb-2 flex items-start justify-between">
        <div className="space-y-1">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-8 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-24 animate-pulse rounded bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-12 w-24 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex-1 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-9 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-1">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-3 w-32 animate-pulse rounded bg-muted" />
              </div>
            </div>
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  )
}
