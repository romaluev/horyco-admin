'use client'

import { Badge } from '@/shared/ui/base/badge'
import { POStatus, PO_STATUS_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface POStatusBadgeProps {
  status: POStatus
  className?: string
}

const statusStyles: Record<POStatus, string> = {
  [POStatus.DRAFT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [POStatus.SENT]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [POStatus.PARTIAL]: 'bg-blue-100 text-blue-800 border-blue-200',
  [POStatus.RECEIVED]: 'bg-green-100 text-green-800 border-green-200',
  [POStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
}

const statusIcons: Record<POStatus, string> = {
  [POStatus.DRAFT]: '⚪',
  [POStatus.SENT]: '🟡',
  [POStatus.PARTIAL]: '🔵',
  [POStatus.RECEIVED]: '🟢',
  [POStatus.CANCELLED]: '🔴',
}

export function POStatusBadge({ status, className }: POStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', statusStyles[status], className)}
    >
      <span className="mr-1">{statusIcons[status]}</span>
      {PO_STATUS_LABELS[status]}
    </Badge>
  )
}
