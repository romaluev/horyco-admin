import { Badge } from '@/shared/ui/base/badge'

import type { SubscriptionStatus } from '../model/types'

interface SubscriptionStatusBadgeProps {
  status: SubscriptionStatus
}

export const SubscriptionStatusBadge = ({
  status,
}: SubscriptionStatusBadgeProps) => {
  const statusConfig: Record<
    SubscriptionStatus,
    {
      label: string
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
  > = {
    trialing: { label: 'Пробный период', variant: 'secondary' },
    active: { label: 'Активна', variant: 'default' },
    suspended: { label: 'Приостановлена', variant: 'destructive' },
    canceled: { label: 'Отменена', variant: 'outline' },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
