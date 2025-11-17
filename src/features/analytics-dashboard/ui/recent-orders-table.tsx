/**
 * Recent Orders Table Component
 * Displays last 10 orders with branch info (if all_branches scope)
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { cn } from '@/shared/lib/utils'
import {
  formatCurrency,
  formatTime,
  getPaymentMethodInfo,
  getOrderStatusInfo,
} from '../lib/utils'

import type {
  IAnalyticsRecentOrder,
  AnalyticsScopeType,
} from '@/entities/analytics'

interface IRecentOrdersTableProps {
  orders: IAnalyticsRecentOrder[]
  scope: AnalyticsScopeType
}

export const RecentOrdersTable = ({
  orders,
  scope,
}: IRecentOrdersTableProps) => {
  const showBranchColumn = scope === 'all_branches'

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Recent Orders {showBranchColumn && '(All Branches)'} (Last 10)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Order</TableHead>
                {showBranchColumn && <TableHead>Branch</TableHead>}
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const paymentInfo = getPaymentMethodInfo(order.paymentMethod)
                const statusInfo = getOrderStatusInfo(order.status)

                return (
                  <TableRow key={order.orderId} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {formatTime(order.createdAt)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {order.number}
                    </TableCell>
                    {showBranchColumn && (
                      <TableCell>
                        {order.branch?.name || 'Unknown'}
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      {formatCurrency(order.total)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{paymentInfo.icon}</span>
                        <span className="text-sm">{paymentInfo.label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={cn(
                          'flex items-center gap-1',
                          statusInfo.colorClass
                        )}
                      >
                        <span>{statusInfo.icon}</span>
                        <span className="text-sm font-medium">
                          {statusInfo.label}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="flex h-48 items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📝</div>
              <p className="text-sm text-muted-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground">in this period</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
