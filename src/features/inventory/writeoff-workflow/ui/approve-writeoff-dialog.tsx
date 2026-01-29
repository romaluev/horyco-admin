'use client'

import { Loader2 } from 'lucide-react'

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

import { useApproveWriteoff } from '@/entities/inventory/writeoff/model/mutations'
import {
  WRITEOFF_REASON_LABELS,
  type IWriteoff,
} from '@/entities/inventory/writeoff/model/types'

interface ApproveWriteoffDialogProps {
  writeoff: IWriteoff
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ApproveWriteoffDialog({
  writeoff,
  open,
  onOpenChange,
  onSuccess,
}: ApproveWriteoffDialogProps) {
  const approveMutation = useApproveWriteoff()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const handleApprove = () => {
    approveMutation.mutate(writeoff.id, {
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
          <AlertDialogTitle>Одобрить списание?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                После одобрения товары будут списаны со склада. Это действие
                нельзя отменить.
              </p>
              <div className="bg-muted space-y-2 rounded-md p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Номер:</span>
                  <span className="font-medium">{writeoff.writeoffNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Склад:</span>
                  <span>{writeoff.warehouseName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Причина:</span>
                  <span>{WRITEOFF_REASON_LABELS[writeoff.reason]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Позиций:</span>
                  <span>{writeoff.items?.length ?? 0}</span>
                </div>
                <div className="mt-2 flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Сумма списания:</span>
                  <span className="text-destructive font-bold">
                    {formatCurrency(writeoff.totalValue)}
                  </span>
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={approveMutation.isPending}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleApprove}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Одобрить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
