'use client'

import { formatPrice } from '@/shared/lib/format'
import { BaseError, BaseLoading } from '@/shared/ui'
import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/ui/base/dialog'
import { Separator } from '@/shared/ui/base/separator'

import {
  useGetInvoiceDetails,
  InvoiceStatusBadge,
} from '@/entities/organization/subscription'

interface InvoiceDetailDialogProps {
  invoiceId: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export const InvoiceDetailDialog = ({
  invoiceId,
  isOpen,
  onOpenChange,
}: InvoiceDetailDialogProps) => {
  const {
    data: invoice,
    isLoading,
    error,
  } = useGetInvoiceDetails(isOpen ? invoiceId : null, isOpen)

  if (!isOpen) return null

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <BaseLoading className="py-8" />
        </DialogContent>
      </Dialog>
    )
  }

  if (error || !invoice) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent>
          <BaseError
            className="py-8"
            message="Ошибка загрузки деталей счета-фактуры"
          />
        </DialogContent>
      </Dialog>
    )
  }

  const handleDownloadPdf = () => {
    if (invoice.invoicePdfUrl) {
      window.open(invoice.invoicePdfUrl, '_blank')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>{invoice.invoiceNumber}</DialogTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {new Date(invoice.periodStart).toLocaleDateString('ru-RU')} -{' '}
                {new Date(invoice.periodEnd).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                ДАТА СЧЕТА
              </p>
              <p className="mt-1 font-medium">
                {new Date(invoice.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium">
                СРОК ОПЛАТЫ
              </p>
              <p className="mt-1 font-medium">
                {new Date(invoice.dueDate).toLocaleDateString('ru-RU')}
              </p>
            </div>
            {invoice.paidAt && (
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  ДАТА ОПЛАТЫ
                </p>
                <p className="mt-1 font-medium">
                  {new Date(invoice.paidAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* Line Items */}
          <div>
            <p className="mb-3 text-sm font-semibold">Товары и услуги</p>
            <div className="space-y-2">
              {invoice.lineItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.quantity} × {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatPrice(item.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Сумма к оплате:</span>
              <span className="font-semibold">
                {formatPrice(invoice.amountDue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Оплачено:</span>
              <span className="font-semibold">
                {formatPrice(invoice.amountPaid)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:flex-row">
          {invoice.invoicePdfUrl && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              Скачать PDF
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
