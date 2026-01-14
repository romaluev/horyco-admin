/**
 * Inventory Item Status Badge Component
 */

import { Badge } from '@/shared/ui/base/badge'
import { cn } from '@/shared/lib/utils'

interface ItemStatusBadgeProps {
  isActive: boolean
  isSemiFinished?: boolean
  className?: string
}

export const ItemStatusBadge = ({
  isActive,
  isSemiFinished = false,
  className,
}: ItemStatusBadgeProps) => {
  if (isSemiFinished) {
    return (
      <Badge variant="outline" className={cn('border-blue-500', className)}>
        Полуфабрикат
      </Badge>
    )
  }

  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={cn(className)}
    >
      {isActive ? 'Активен' : 'Неактивен'}
    </Badge>
  )
}
