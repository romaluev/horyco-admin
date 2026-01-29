'use client'

import { useMemo } from 'react'

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

import { useApproveCount } from '@/entities/inventory/inventory-count/model/mutations'

import type { IInventoryCount, ICountVarianceSummary } from '@/entities/inventory/inventory-count/model/types'


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

  // Calculate variance values from items if not provided in count
  const calculatedValues = useMemo(() => {
    if (variance) {
      return {
        itemsWithVariance: variance.itemsWithVariance,
        shortageValue: variance.shortageValue,
        surplusValue: variance.surplusValue,
        netAdjustmentValue: variance.netAdjustmentValue,
        totalCounted: variance.totalItemsCounted,
      }
    }

    // Calculate from items if available
    if (count.items && count.items.length > 0) {
      let shortageValue = 0
      let surplusValue = 0
      let itemsWithVariance = 0

      count.items.forEach((item) => {
        const variance = item.variance ?? 0
        const unitCost = item.unitCost ?? 0
        const varianceValue = variance * unitCost

        if (variance !== 0) {
          itemsWithVariance++
          if (variance < 0) {
            shortageValue += Math.abs(varianceValue)
          } else {
            surplusValue += varianceValue
          }
        }
      })

      return {
        itemsWithVariance,
        shortageValue,
        surplusValue,
        netAdjustmentValue: surplusValue - shortageValue,
        totalCounted: count.items.filter((i) => i.isCounted).length,
      }
    }

    // Fallback to count values
    return {
      itemsWithVariance: count.itemsWithVariance ?? 0,
      shortageValue: count.shortageValue ?? 0,
      surplusValue: count.surplusValue ?? 0,
      netAdjustmentValue: count.netAdjustmentValue ?? 0,
      totalCounted: count.itemsCounted ?? 0,
    }
  }, [count, variance])

  const formatCurrency = (value: number | undefined | null) => {
    const safeValue = value ?? 0
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(safeValue)
  }

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
                  <span>{calculatedValues.itemsWithVariance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Недостача:</span>
                  <span className="text-destructive">
                    {formatCurrency(calculatedValues.shortageValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Излишек:</span>
                  <span className="text-green-600">
                    {formatCurrency(calculatedValues.surplusValue)}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Итого корректировка:</span>
                  <span
                    className={
                      calculatedValues.netAdjustmentValue < 0
                        ? 'text-destructive'
                        : 'text-green-600'
                    }
                  >
                    {calculatedValues.netAdjustmentValue >= 0 ? '+' : ''}
                    {formatCurrency(calculatedValues.netAdjustmentValue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground pt-1">
                  <span>Подсчитано товаров:</span>
                  <span>{calculatedValues.totalCounted}</span>
                </div>
                {variance && (
                  <div className="flex justify-between text-sm text-muted-foreground">
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
