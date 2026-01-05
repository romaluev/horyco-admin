'use client'

import { Badge } from '@/shared/ui/base/badge'
import { CountType, COUNT_TYPE_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface CountTypeBadgeProps {
  type: CountType
  className?: string
}

const typeStyles: Record<CountType, string> = {
  [CountType.FULL]: 'bg-purple-100 text-purple-800 border-purple-200',
  [CountType.CYCLE]: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  [CountType.SPOT]: 'bg-pink-100 text-pink-800 border-pink-200',
}

export function CountTypeBadge({ type, className }: CountTypeBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', typeStyles[type], className)}
    >
      {COUNT_TYPE_LABELS[type]}
    </Badge>
  )
}
