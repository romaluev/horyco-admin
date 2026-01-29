'use client'

import { Phone, Mail, MapPin, Clock, Package } from 'lucide-react'

import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'

import type { ISupplier } from '../model/types'

interface ISupplierCardProps {
  supplier: ISupplier
  onClick?: () => void
}

export function SupplierCard({ supplier, onClick }: ISupplierCardProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <Card
      className={onClick ? 'cursor-pointer hover:border-primary transition-colors' : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{supplier.name}</CardTitle>
          <Badge variant={supplier.isActive ? 'default' : 'secondary'}>
            {supplier.isActive ? 'Активен' : 'Неактивен'}
          </Badge>
        </div>
        {supplier.code && (
          <p className="text-sm text-muted-foreground">{supplier.code}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        {supplier.contactName && (
          <p className="text-sm font-medium">{supplier.contactName}</p>
        )}

        <div className="space-y-1.5 text-sm text-muted-foreground">
          {supplier.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{supplier.phone}</span>
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{supplier.email}</span>
            </div>
          )}
          {supplier.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="line-clamp-1">{supplier.address}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{supplier.leadTimeDays} дн.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{supplier.totalOrders} заказов</span>
          </div>
        </div>

        {supplier.totalAmount > 0 && (
          <p className="text-sm">
            Всего: <span className="font-medium">{formatCurrency(supplier.totalAmount)}</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
