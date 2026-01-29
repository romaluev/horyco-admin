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

import { useCancelProduction } from '@/entities/inventory/production-order/model/mutations'


interface CancelProductionDialogProps {
  orderId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CancelProductionDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: CancelProductionDialogProps) {
  const cancelMutation = useCancelProduction()

  const handleCancel = () => {
    cancelMutation.mutate(orderId, {
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
          <AlertDialogTitle>Отменить производство?</AlertDialogTitle>
          <AlertDialogDescription>
            Производство будет отменено. Если ингредиенты уже были списаны, они
            будут возвращены на склад.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={cancelMutation.isPending}>
            Назад
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={cancelMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {cancelMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Отменить производство
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
