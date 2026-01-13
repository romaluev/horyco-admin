/**
 * Warehouse Badge Component
 * Display warehouse status badge
 */

import { Badge } from '@/shared/ui/base/badge'
import { cn } from '@/shared/lib/utils'

interface WarehouseBadgeProps {
  isActive: boolean
  className?: string
}

export const WarehouseBadge = ({ isActive, className }: WarehouseBadgeProps) => {
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(className)}
    >
      {isActive ? 'Активен' : 'Неактивен'}
    </Badge>
  )
}
