'use client'

import * as React from 'react'

import { format } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/base/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

type PaymentMethod =
  | 'CASH'
  | 'CARD'
  | 'CREDIT'
  | 'PAYME'
  | 'CLICK'
  | 'UZUM'
  | 'BANK_TRANSFER'
  | 'MIXED'
type OrderStatus = 'PAID' | 'PARTIALLY_PAID' | 'NOT_PAID'

export interface RecentOrder {
  id: string
  number: string
  createdAt: string
  total: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  branch?: {
    id: number
    name: string
  } | null
}

interface RecentOrdersProps {
  orders: RecentOrder[]
  isLoading?: boolean
  compact?: boolean
  showBranch?: boolean
}

const PAYMENT_METHOD_CONFIG: Record<
  PaymentMethod,
  { icon: string; label: string }
> = {
  CASH: { icon: '💵', label: 'Наличные' },
  CARD: { icon: '💳', label: 'Карта' },
  CREDIT: { icon: '💳', label: 'Кредит' },
  PAYME: { icon: '📱', label: 'Payme' },
  CLICK: { icon: '📱', label: 'Click' },
  UZUM: { icon: '💳', label: 'Uzum' },
  BANK_TRANSFER: { icon: '🏦', label: 'Перевод' },
  MIXED: { icon: '🔀', label: 'Смешанный' },
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { icon: string; label: string; className: string }
> = {
  PAID: { icon: '✓', label: 'Оплачен', className: 'text-green-600' },
  PARTIALLY_PAID: {
    icon: '⏳',
    label: 'Частично',
    className: 'text-orange-600',
  },
  NOT_PAID: { icon: '⏸️', label: 'Не оплачен', className: 'text-gray-600' },
}

export function RecentOrders({
  orders,
  isLoading = false,
  compact = false,
  showBranch = false,
}: RecentOrdersProps) {
  const formatCurrency = (amount: number) => {
    const formatted = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    return `${formatted} UZS`
  }

  const formatTime = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'HH:mm')
    } catch (e) {
      return ''
    }
  }

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <div className="bg-muted h-6 w-48 animate-pulse rounded" />
          {!compact && (
            <div className="bg-muted h-4 w-64 animate-pulse rounded" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="bg-muted h-5 w-12 animate-pulse rounded" />
                <div className="bg-muted h-5 w-24 animate-pulse rounded" />
                <div className="bg-muted h-5 flex-1 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Последние заказы</CardTitle>
          {!compact && <CardDescription>Последние 10 заказов</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Нет заказов</p>
              <p className="text-muted-foreground text-sm">в этом периоде</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Последние заказы</CardTitle>
        {!compact && (
          <CardDescription>
            {showBranch
              ? 'Последние 10 заказов (все филиалы)'
              : 'Последние 10 заказов'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Время</TableHead>
                <TableHead>Заказ</TableHead>
                {showBranch && <TableHead>Филиал</TableHead>}
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Оплата</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const paymentConfig = PAYMENT_METHOD_CONFIG[order.paymentMethod]
                const statusConfig = STATUS_CONFIG[order.status]

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm">
                      {formatTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.number}
                    </TableCell>
                    {showBranch && (
                      <TableCell className="text-muted-foreground text-sm">
                        {order.branch?.name || '-'}
                      </TableCell>
                    )}
                    <TableCell className="text-right font-medium">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{paymentConfig.icon}</span>
                        <span className="text-sm">{paymentConfig.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 ${statusConfig.className}`}
                      >
                        <span>{statusConfig.icon}</span>
                        <span className="text-sm">{statusConfig.label}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
