'use client'

import { Badge } from '@/shared/ui/base/badge'
import { WriteoffStatus, WRITEOFF_STATUS_LABELS } from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface WriteoffStatusBadgeProps {
  status: WriteoffStatus
  className?: string
}

const statusStyles: Record<WriteoffStatus, string> = {
  [WriteoffStatus.DRAFT]: 'bg-gray-100 text-gray-800 border-gray-200',
  [WriteoffStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  [WriteoffStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
  [WriteoffStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
}

export function WriteoffStatusBadge({
  status,
  className,
}: WriteoffStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', statusStyles[status], className)}
    >
      {WRITEOFF_STATUS_LABELS[status]}
    </Badge>
  )
}
