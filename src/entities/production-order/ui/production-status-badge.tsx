'use client'

import { Badge } from '@/shared/ui/base/badge'
import { PRODUCTION_STATUS_LABELS, type ProductionStatus } from '../model/types'

interface IProductionStatusBadgeProps {
  status: ProductionStatus
}

export function ProductionStatusBadge({ status }: IProductionStatusBadgeProps) {
  const variants: Record<ProductionStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    planned: 'secondary',
    in_progress: 'outline',
    completed: 'default',
    cancelled: 'destructive',
  }

  return (
    <Badge variant={variants[status]}>
      {PRODUCTION_STATUS_LABELS[status]}
    </Badge>
  )
}
