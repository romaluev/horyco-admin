'use client'

import { Badge } from '@/shared/ui/base/badge'
import { COUNT_STATUS_LABELS, type CountStatus } from '../model/types'

interface ICountStatusBadgeProps {
  status: CountStatus
}

export function CountStatusBadge({ status }: ICountStatusBadgeProps) {
  const variants: Record<CountStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    in_progress: 'secondary',
    pending_approval: 'outline',
    completed: 'default',
    cancelled: 'destructive',
  }

  return (
    <Badge variant={variants[status]}>
      {COUNT_STATUS_LABELS[status]}
    </Badge>
  )
}
