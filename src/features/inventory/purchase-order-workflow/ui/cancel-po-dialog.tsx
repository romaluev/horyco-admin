'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'


import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Textarea } from '@/shared/ui/base/textarea'

import { useCancelPurchaseOrder } from '@/entities/inventory/purchase-order/model/mutations'

const cancelSchema = z.object({
  reason: z.string().min(1, 'Укажите причину отмены'),
})

type CancelFormValues = z.infer<typeof cancelSchema>

interface CancelPODialogProps {
  orderId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CancelPODialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: CancelPODialogProps) {
  const cancelMutation = useCancelPurchaseOrder()

  const form = useForm<CancelFormValues>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reason: '',
    },
  })

  const handleSubmit = (values: CancelFormValues) => {
    cancelMutation.mutate(
      {
        id: orderId,
        data: { reason: values.reason },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Отменить заказ?</DialogTitle>
          <DialogDescription>
            Это действие нельзя отменить. Укажите причину отмены заказа.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина отмены</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите причину отмены заказа..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={cancelMutation.isPending}
              >
                Назад
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Отменить заказ
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
