'use client'

import { Loader2 } from 'lucide-react'

import { useApproveCount } from '@/entities/inventory-count/model/mutations'
import type { IInventoryCount, ICountVarianceSummary } from '@/entities/inventory-count/model/types'

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

interface ApproveCountDialogProps {
  count: IInventoryCount
  variance?: ICountVarianceSummary | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ApproveCountDialog({
  count,
  variance,
  open,
  onOpenChange,
  onSuccess,
}: ApproveCountDialogProps) {
  const approveMutation = useApproveCount()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const handleApprove = () => {
    approveMutation.mutate(count.id, {
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
          <AlertDialogTitle>Одобрить инвентаризацию?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                При одобрении инвентаризации <strong>{count.countNumber}</strong>{' '}
                остатки на складе будут скорректированы согласно результатам
                подсчёта.
              </p>
              <p className="text-destructive font-medium">
                Это действие нельзя отменить!
              </p>
              <div className="bg-muted mt-4 rounded-md p-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Товаров с расхождениями:</span>
                  <span>
                    {variance?.itemsWithVariance || count.itemsWithVariance}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Недостача:</span>
                  <span className="text-destructive">
                    {formatCurrency(variance?.shortageValue || count.shortageValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Излишек:</span>
                  <span className="text-green-600">
                    {formatCurrency(variance?.surplusValue || count.surplusValue)}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Итого корректировка:</span>
                  <span
                    className={
                      count.netAdjustmentValue < 0
                        ? 'text-destructive'
                        : 'text-green-600'
                    }
                  >
                    {count.netAdjustmentValue >= 0 ? '+' : ''}
                    {formatCurrency(count.netAdjustmentValue)}
                  </span>
                </div>
                {variance && (
                  <div className="flex justify-between text-sm text-muted-foreground pt-1">
                    <span>Точность инвентаризации:</span>
                    <span>{variance.accuracyPct.toFixed(1)}%</span>
                  </div>
                )}
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
