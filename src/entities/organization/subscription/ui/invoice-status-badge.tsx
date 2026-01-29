import { Badge } from '@/shared/ui/base/badge'

import type { InvoiceStatus } from '../model/types'

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
}

export const InvoiceStatusBadge = ({ status }: InvoiceStatusBadgeProps) => {
  const statusConfig: Record<
    InvoiceStatus,
    {
      label: string
      variant: 'default' | 'secondary' | 'destructive' | 'outline'
    }
  > = {
    draft: { label: 'Черновик', variant: 'secondary' },
    open: { label: 'На ожидании платежа', variant: 'outline' },
    paid: { label: 'Оплачено', variant: 'default' },
    void: { label: 'Отменено', variant: 'destructive' },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
