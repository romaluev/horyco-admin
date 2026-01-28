'use client'

import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react'

import { useAnimatedCounter } from '@/shared/hooks/use-animated-counter'
import { cn } from '@/shared/lib/utils'

import { COUNTER_ANIMATION_DURATION } from '@/entities/dashboard/dashboard-widget'

import type { WidgetConfig, WidgetData } from '@/entities/dashboard/dashboard-widget'

interface NumberWidgetProps {
  data: WidgetData
  config: WidgetConfig
}

function formatValue(value: number, isCurrency = false): string {
  if (isCurrency) {
    return `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')  } UZS`
  }
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)  }M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)  }K`
  }
  return value.toString()
}

export function NumberWidget({ data, config }: NumberWidgetProps) {
  const { displayValue, isAnimating } = useAnimatedCounter(data.value ?? 0, {
    duration: COUNTER_ANIMATION_DURATION,
    enabled: config.showAnimation ?? true,
  })

  const changePercent = data.changePercent ?? data.change
  const isPositive = (changePercent ?? 0) > 0
  const isCurrency =
    config.dataField.field === 'revenue' ||
    config.dataField.field === 'avgCheck'

  return (
    <div className="flex h-full flex-col justify-center">
      <div
        className={cn(
          'text-3xl font-bold transition-all',
          isAnimating && 'blur-[0.3px]'
        )}
      >
        {formatValue(displayValue, isCurrency)}
      </div>

      {config.showTrend && changePercent !== undefined && changePercent !== null && (
        <div
          className={cn(
            'mt-1 flex items-center text-sm',
            isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {isPositive ? (
            <IconTrendingUp className="mr-1 h-4 w-4" />
          ) : (
            <IconTrendingDown className="mr-1 h-4 w-4" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {changePercent.toFixed(1)}%
          </span>
        </div>
      )}
    </div>
  )
}
