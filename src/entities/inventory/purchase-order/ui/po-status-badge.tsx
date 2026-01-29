'use client'

import { Badge } from '@/shared/ui/base/badge'

import { PO_STATUS_LABELS, type POStatus } from '../model/types'

interface IPOStatusBadgeProps {
  status: POStatus
}

export function POStatusBadge({ status }: IPOStatusBadgeProps) {
  const variants: Record<
    POStatus,
    'default' | 'secondary' | 'destructive' | 'outline'
  > = {
    draft: 'secondary',
    sent: 'outline',
    partial: 'default',
    received: 'default',
    cancelled: 'destructive',
  }

  return <Badge variant={variants[status]}>{PO_STATUS_LABELS[status]}</Badge>
}
