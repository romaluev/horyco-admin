'use client'

import { Loader2 } from 'lucide-react'

import { useSendPurchaseOrder } from '@/entities/inventory/purchase-order/model/mutations'
import type { IPurchaseOrder } from '@/entities/inventory/purchase-order/model/types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/base/alert-dialog'

interface SendPODialogProps {
  order: IPurchaseOrder
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function SendPODialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: SendPODialogProps) {
  const sendMutation = useSendPurchaseOrder()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const handleSend = () => {
    sendMutation.mutate(order.id, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отправить заказ поставщику?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Заказ <strong>{order.poNumber}</strong> будет отправлен поставщику{' '}
                <strong>{order.supplierName}</strong>.
              </p>
              <p>После отправки заказ нельзя будет редактировать.</p>
              <div className="bg-muted mt-4 rounded-md p-3">
                <div className="flex justify-between">
                  <span>Товаров:</span>
                  <span>{order.items?.length || 0}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Сумма:</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={sendMutation.isPending}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSend}
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Отправить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
