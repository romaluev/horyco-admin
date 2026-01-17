'use client'

import { Badge } from '@/shared/ui/base/badge'
import { WRITEOFF_STATUS_LABELS, type WriteoffStatus } from '../model/types'

interface IWriteoffStatusBadgeProps {
  status: WriteoffStatus
}

export function WriteoffStatusBadge({ status }: IWriteoffStatusBadgeProps) {
  const variants: Record<WriteoffStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    draft: 'secondary',
    pending: 'outline',
    approved: 'default',
    rejected: 'destructive',
  }

  return (
    <Badge variant={variants[status]}>
      {WRITEOFF_STATUS_LABELS[status]}
    </Badge>
  )
}
