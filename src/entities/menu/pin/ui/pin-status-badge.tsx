/**
 * PIN Status Badge Component
 * Displays PIN status with color-coded indicator
 */

import { Badge } from '@/shared/ui/base/badge'

import { PIN_WARNING_THRESHOLD_DAYS } from '../model/constants'

import type { IPinStatusResponse } from '../model/types'

interface PinStatusBadgeProps {
  status: IPinStatusResponse | undefined
  isLoading?: boolean
}

export const PinStatusBadge = ({ status, isLoading }: PinStatusBadgeProps) => {
  if (isLoading) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Загрузка...
      </Badge>
    )
  }

  if (!status?.hasPin) {
    return (
      <Badge variant="destructive" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-current" />
        PIN не установлен
      </Badge>
    )
  }

  if (!status.pinEnabled) {
    return (
      <Badge variant="outline" className="gap-1 text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-current" />
        PIN отключен
      </Badge>
    )
  }

  if (status.isExpired) {
    return (
      <Badge variant="destructive" className="gap-1">
        <span className="h-2 w-2 rounded-full bg-current" />
        PIN истек
      </Badge>
    )
  }

  // Active PIN - check expiration warning threshold
  const daysLeft = status.daysUntilExpiration || 0

  if (daysLeft <= PIN_WARNING_THRESHOLD_DAYS && daysLeft > 0) {
    return (
      <Badge variant="outline" className="gap-1 border-yellow-500 text-yellow-600">
        <span className="h-2 w-2 rounded-full bg-current" />
        Истекает через {daysLeft}д
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
      <span className="h-2 w-2 rounded-full bg-current" />
      Активен ({daysLeft}д)
    </Badge>
  )
}
