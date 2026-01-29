'use client'

import { useTranslation } from 'react-i18next'

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

import { useGetPaymentHistory } from '@/entities/organization/subscription'

export const PaymentsHistory = () => {
  const { t } = useTranslation('organization')
  const { data: paymentHistory, isLoading, error } = useGetPaymentHistory()

  if (isLoading) return <BaseLoading className="py-10" />
  if (error)
    return (
      <BaseError className="py-10" message={t('paymentsHistory.loadError')} />
    )
  if (!paymentHistory) return null

  const paymentTypeLabel: Record<string, string> = {
    cash: t('paymentsHistory.table.cash'),
    bank_transfer: t('paymentsHistory.table.bankTransfer'),
    card: t('paymentsHistory.table.card'),
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t('paymentsHistory.summary.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground text-sm">
                {t('paymentsHistory.summary.totalPaid')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {formatPrice(paymentHistory.summary.totalPaid)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                {t('paymentsHistory.summary.paymentsCount')}
              </p>
              <p className="mt-1 text-lg font-semibold">
                {paymentHistory.summary.paymentsCount}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                {t('paymentsHistory.summary.lastPayment')}
              </p>
              <p className="mt-1 text-sm font-medium">
                {new Date(
                  paymentHistory.summary.lastPaymentAt
                ).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      {paymentHistory.data.length > 0 ? (
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  {t('paymentsHistory.table.receiptNumber')}
                </TableHead>
                <TableHead>{t('paymentsHistory.table.paymentType')}</TableHead>
                <TableHead>{t('paymentsHistory.table.amount')}</TableHead>
                <TableHead>{t('paymentsHistory.table.date')}</TableHead>
                <TableHead>{t('paymentsHistory.table.status')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.data.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.receiptNumber}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">
                      {paymentTypeLabel[payment.paymentType] ||
                        payment.paymentType}
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
                      {payment.isVerified
                        ? t('paymentsHistory.table.verified')
                        : t('paymentsHistory.table.pending')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground text-sm">
            {t('paymentsHistory.table.noPayments')}
          </p>
        </div>
      )}
    </div>
  )
}
