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
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'

import { useCompleteProduction } from '@/entities/inventory/production-order/model/mutations'

import type { IProductionOrder } from '@/entities/inventory/production-order/model/types'

const completeSchema = z.object({
  actualQuantity: z.number().min(0.01, 'Количество должно быть больше 0'),
  notes: z.string().optional(),
})

type CompleteFormValues = z.infer<typeof completeSchema>

interface CompleteProductionDialogProps {
  order: IProductionOrder
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CompleteProductionDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: CompleteProductionDialogProps) {
  const completeMutation = useCompleteProduction()

  const form = useForm<CompleteFormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      actualQuantity: order.plannedQuantity,
      notes: '',
    },
  })

  const actualQuantity = form.watch('actualQuantity')
  const variance = actualQuantity - order.plannedQuantity
  const variancePercent = ((variance / order.plannedQuantity) * 100).toFixed(1)

  const handleSubmit = (values: CompleteFormValues) => {
    completeMutation.mutate(
      {
        id: order.id,
        data: {
          actualQuantity: values.actualQuantity,
          notes: values.notes || undefined,
        },
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
          <DialogTitle>Завершить производство</DialogTitle>
          <DialogDescription>
            Укажите фактическое количество произведённого продукта. Продукт
            будет добавлен на склад.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted mb-4 space-y-1 rounded-md p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Продукт:</span>
            <span className="font-medium">{order.outputItemName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Плановое количество:</span>
            <span className="font-medium">
              {order.plannedQuantity} {order.outputUnit}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="actualQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Фактическое количество ({order.outputUnit})
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {variance !== 0 && (
              <div
                className={`rounded-md p-3 text-sm ${
                  variance > 0
                    ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                }`}
              >
                <div className="flex justify-between">
                  <span>Отклонение:</span>
                  <span className="font-medium">
                    {variance > 0 ? '+' : ''}
                    {variance.toFixed(2)} {order.outputUnit} ({variancePercent}
                    %)
                  </span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Комментарий к производству..."
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
                disabled={completeMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={completeMutation.isPending}>
                {completeMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Завершить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
