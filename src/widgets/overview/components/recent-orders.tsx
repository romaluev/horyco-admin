'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

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
  { icon: string; labelKey: string }
> = {
  CASH: { icon: '💵', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.CASH' },
  CARD: { icon: '💳', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.CARD' },
  CREDIT: { icon: '💳', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.CREDIT' },
  PAYME: { icon: '📱', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.PAYME' },
  CLICK: { icon: '📱', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.CLICK' },
  UZUM: { icon: '💳', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.UZUM' },
  BANK_TRANSFER: { icon: '🏦', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.BANK_TRANSFER' },
  MIXED: { icon: '🔀', labelKey: 'dashboard.widgets.recentOrders.paymentMethods.MIXED' },
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { icon: string; labelKey: string; className: string }
> = {
  PAID: { icon: '✓', labelKey: 'dashboard.widgets.recentOrders.statuses.PAID', className: 'text-green-600' },
  PARTIALLY_PAID: {
    icon: '⏳',
    labelKey: 'dashboard.widgets.recentOrders.statuses.PARTIALLY_PAID',
    className: 'text-orange-600',
  },
  NOT_PAID: { icon: '⏸️', labelKey: 'dashboard.widgets.recentOrders.statuses.NOT_PAID', className: 'text-gray-600' },
}

export function RecentOrders({
  orders,
  isLoading = false,
  compact = false,
  showBranch = false,
}: RecentOrdersProps) {
  const { t } = useTranslation('dashboard')

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
          <CardTitle>{t('dashboard.widgets.recentOrders.title')}</CardTitle>
          {!compact && <CardDescription>{t('dashboard.widgets.recentOrders.subtitle')}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="flex h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">{t('dashboard.widgets.recentOrders.noOrders')}</p>
              <p className="text-muted-foreground text-sm">{t('dashboard.widgets.recentOrders.period')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t('dashboard.widgets.recentOrders.title')}</CardTitle>
        {!compact && (
          <CardDescription>
            {showBranch
              ? t('dashboard.widgets.recentOrders.allBranches')
              : t('dashboard.widgets.recentOrders.subtitle')}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">{t('dashboard.widgets.recentOrders.table.time')}</TableHead>
                <TableHead>{t('dashboard.widgets.recentOrders.table.order')}</TableHead>
                {showBranch && <TableHead>{t('dashboard.widgets.recentOrders.table.branch')}</TableHead>}
                <TableHead className="text-right">{t('dashboard.widgets.recentOrders.table.amount')}</TableHead>
                <TableHead>{t('dashboard.widgets.recentOrders.table.payment')}</TableHead>
                <TableHead>{t('dashboard.widgets.recentOrders.table.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const paymentConfig = PAYMENT_METHOD_CONFIG[
                  order.paymentMethod
                ]
                const statusConfig = STATUS_CONFIG[order.status]

                const paymentLabel = paymentConfig ? t(paymentConfig.labelKey) : order.paymentMethod || 'Unknown'
                const paymentIcon = paymentConfig?.icon || '❓'
                const statusLabel = statusConfig ? t(statusConfig.labelKey) : order.status || 'Unknown'
                const statusIcon = statusConfig?.icon || '❓'
                const statusClassName = statusConfig?.className || 'text-gray-600'

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
                        <span>{paymentIcon}</span>
                        <span className="text-sm">{paymentLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 ${statusClassName}`}
                      >
                        <span>{statusIcon}</span>
                        <span className="text-sm">{statusLabel}</span>
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
