'use client'

import { formatPrice } from '@/shared/lib/format'
import { BaseError, BaseLoading } from '@/shared/ui'
import { Badge } from '@/shared/ui/base/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { useGetPaymentHistory } from '@/entities/subscription'

export const PaymentsHistory = () => {
  const { data: paymentHistory, isLoading, error } = useGetPaymentHistory()

  if (isLoading) return <BaseLoading className="py-10" />
  if (error)
    return <BaseError className="py-10" message="Ошибка загрузки истории платежей" />
  if (!paymentHistory) return null

  const paymentTypeLabel: Record<string, string> = {
    cash: 'Наличные',
    bank_transfer: 'Банковский перевод',
    card: 'Карта',
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Сводка платежей</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Всего оплачено</p>
              <p className="mt-1 text-lg font-semibold">
                {formatPrice(paymentHistory.summary.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Количество платежей</p>
              <p className="mt-1 text-lg font-semibold">
                {paymentHistory.summary.paymentsCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Последний платеж</p>
              <p className="mt-1 text-sm font-medium">
                {new Date(paymentHistory.summary.lastPaymentAt).toLocaleDateString(
                  'ru-RU'
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      {paymentHistory.data.length > 0 ? (
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер квитанции</TableHead>
                <TableHead>Тип платежа</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {paymentTypeLabel[payment.paymentType] || payment.paymentType}
                    </p>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(payment.amountReceived)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(payment.receivedAt).toLocaleDateString('ru-RU')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={payment.isVerified ? 'default' : 'outline'}>
                      {payment.isVerified ? 'Проверено' : 'На ожидании'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">Платежи не найдены</p>
        </div>
      )}
    </div>
  )
}
