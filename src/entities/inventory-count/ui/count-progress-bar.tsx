'use client'

import { cn } from '@/shared/lib/utils'

interface CountProgressBarProps {
  totalItems: number
  countedItems: number
  className?: string
  showLabel?: boolean
}

export function CountProgressBar({
  totalItems,
  countedItems,
  className,
  showLabel = true,
}: CountProgressBarProps) {
  const percentage = totalItems > 0 ? (countedItems / totalItems) * 100 : 0
  const isComplete = countedItems >= totalItems

  return (
    <div className={cn('space-y-1', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {countedItems} из {totalItems}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isComplete ? 'bg-green-500' : 'bg-primary'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}
