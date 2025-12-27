'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import { Badge } from '@/shared/ui/base/badge'
import { Icons } from '@/shared/ui/icons'

import type { ISupplier } from '../model/types'

interface SupplierCardProps {
  supplier: ISupplier
  onClick?: () => void
  className?: string
}

export function SupplierCard({ supplier, onClick, className }: SupplierCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  return (
    <Card
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{supplier.name}</CardTitle>
            {supplier.code && (
              <p className="text-sm text-muted-foreground">{supplier.code}</p>
            )}
          </div>
          <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
            {supplier.isActive ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          {supplier.contactName && (
            <div className="flex items-center gap-2">
              <Icons.user className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.contactName}</span>
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center gap-2">
              <Icons.phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone}</span>
            </div>
          )}
          {supplier.leadTimeDays && (
            <div className="flex items-center gap-2">
              <Icons.truckDelivery className="h-4 w-4 text-muted-foreground" />
              <span>Срок доставки: {supplier.leadTimeDays} дн.</span>
            </div>
          )}
          {supplier.totalOrders !== undefined && (
            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Заказов:</span>
              <span className="font-medium">{supplier.totalOrders}</span>
            </div>
          )}
          {supplier.totalSpent !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Сумма:</span>
              <span className="font-medium">
                {formatCurrency(supplier.totalSpent)} UZS
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
