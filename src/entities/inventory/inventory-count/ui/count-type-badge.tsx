'use client'

import { Badge } from '@/shared/ui/base/badge'

import { COUNT_TYPE_LABELS, type CountType } from '../model/types'

interface ICountTypeBadgeProps {
  type: CountType
}

export function CountTypeBadge({ type }: ICountTypeBadgeProps) {
  return (
    <Badge variant="outline">
      {COUNT_TYPE_LABELS[type]}
    </Badge>
  )
}
