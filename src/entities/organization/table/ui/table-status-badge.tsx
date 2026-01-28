import { Badge } from '@/shared/ui/base/badge'

import type { TableStatus } from '../model/types'

interface ITableStatusBadgeProps {
  status: TableStatus
}

export const TableStatusBadge = ({ status }: ITableStatusBadgeProps) => {
  const statusConfig = {
    AVAILABLE: {
      label: 'Свободен',
      variant: 'default' as const,
      className: 'bg-green-500 hover:bg-green-600',
    },
    OCCUPIED: {
      label: 'Занят',
      variant: 'destructive' as const,
      className: '',
    },
    RESERVED: {
      label: 'Забронирован',
      variant: 'secondary' as const,
      className: 'bg-yellow-500 hover:bg-yellow-600',
    },
    INACTIVE: {
      label: 'Неактивен',
      variant: 'outline' as const,
      className: '',
    },
  }

  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
