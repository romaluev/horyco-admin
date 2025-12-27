'use client'

import { Badge } from '@/shared/ui/base/badge'
import { CountStatus, COUNT_STATUS_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface CountStatusBadgeProps {
  status: CountStatus
  className?: string
}

const statusStyles: Record<CountStatus, string> = {
  [CountStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [CountStatus.COMPLETED]: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  [CountStatus.PENDING_APPROVAL]:
    'bg-yellow-100 text-yellow-800 border-yellow-200',
  [CountStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
  [CountStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
  [CountStatus.CANCELLED]: 'bg-gray-100 text-gray-800 border-gray-200',
}

export function CountStatusBadge({ status, className }: CountStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', statusStyles[status], className)}
    >
      {COUNT_STATUS_LABELS[status]}
    </Badge>
  )
}
