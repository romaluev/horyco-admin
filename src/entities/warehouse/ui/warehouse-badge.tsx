'use client'

import { Badge } from '@/shared/ui/base/badge'
import { Icons } from '@/shared/ui/icons'

interface WarehouseBadgeProps {
  name: string
  isDefault?: boolean
  className?: string
}

export function WarehouseBadge({ name, isDefault, className }: WarehouseBadgeProps) {
  return (
    <Badge variant="outline" className={className}>
      <Icons.warehouse className="mr-1 h-3 w-3" />
      {name}
      {isDefault && ' (основной)'}
    </Badge>
  )
}
