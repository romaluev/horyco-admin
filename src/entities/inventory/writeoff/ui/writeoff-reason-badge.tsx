'use client'

import { Badge } from '@/shared/ui/base/badge'
import { WRITEOFF_REASON_LABELS, type WriteoffReason } from '../model/types'

interface IWriteoffReasonBadgeProps {
  reason: WriteoffReason
}

export function WriteoffReasonBadge({ reason }: IWriteoffReasonBadgeProps) {
  return (
    <Badge variant="outline">
      {WRITEOFF_REASON_LABELS[reason]}
    </Badge>
  )
}
