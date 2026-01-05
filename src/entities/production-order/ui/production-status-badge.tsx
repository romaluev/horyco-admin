'use client'

import { Badge } from '@/shared/ui/base/badge'
import {
  ProductionStatus,
  PRODUCTION_STATUS_LABELS,
} from '@/shared/types/inventory'
import { cn } from '@/shared/lib/utils'

interface ProductionStatusBadgeProps {
  status: ProductionStatus
  className?: string
}

const statusStyles: Record<ProductionStatus, string> = {
  [ProductionStatus.PLANNED]: 'bg-gray-100 text-gray-800 border-gray-200',
  [ProductionStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800 border-blue-200',
  [ProductionStatus.COMPLETED]: 'bg-green-100 text-green-800 border-green-200',
  [ProductionStatus.CANCELLED]: 'bg-red-100 text-red-800 border-red-200',
}

export function ProductionStatusBadge({
  status,
  className,
}: ProductionStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('font-normal', statusStyles[status], className)}
    >
      {PRODUCTION_STATUS_LABELS[status]}
    </Badge>
  )
}
