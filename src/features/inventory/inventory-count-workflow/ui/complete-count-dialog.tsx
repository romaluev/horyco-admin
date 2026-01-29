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

import { useCompleteCount } from '@/entities/inventory/inventory-count/model/mutations'

import type {
  IInventoryCount,
  ICountVarianceSummary,
} from '@/entities/inventory/inventory-count/model/types'

interface CompleteCountDialogProps {
  count: IInventoryCount
  variance?: ICountVarianceSummary | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CompleteCountDialog({
  count,
  variance,
  open,
  onOpenChange,
  onSuccess,
}: CompleteCountDialogProps) {
  const completeMutation = useCompleteCount()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const handleComplete = () => {
    completeMutation.mutate(count.id, {
      onSuccess: () => {
        onOpenChange(false)
        onSuccess?.()
      },
    })
  }

  const countedItems = count.items?.filter((i) => i.isCounted).length || 0
  const totalItems = count.items?.length || 0
  const uncountedItems = totalItems - countedItems

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Завершить подсчёт?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-2">
              <p>
                Инвентаризация <strong>{count.countNumber}</strong> будет
                завершена и отправлена на согласование.
              </p>
              {uncountedItems > 0 && (
                <p className="text-destructive">
                  Внимание: {uncountedItems} товаров не подсчитаны. Они будут
                  считаться с нулевым остатком.
                </p>
              )}
              <div className="bg-muted mt-4 space-y-1 rounded-md p-3">
                <div className="flex justify-between text-sm">
                  <span>Подсчитано товаров:</span>
                  <span>
                    {countedItems} / {totalItems}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Недостача:</span>
                  <span className="text-destructive">
                    {formatCurrency(
                      variance?.shortageValue || count.shortageValue
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Излишек:</span>
                  <span className="text-green-600">
                    {formatCurrency(
                      variance?.surplusValue || count.surplusValue
                    )}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-1 font-medium">
                  <span>Итого расхождение:</span>
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
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={completeMutation.isPending}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleComplete}
            disabled={completeMutation.isPending}
          >
            {completeMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Завершить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
