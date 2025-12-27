'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconAdjustmentsHorizontal } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/base/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'

import { useAdjustStock } from '@/entities/stock'
import { ItemSelector } from '@/entities/inventory-item'

import { stockAdjustmentSchema } from '../model/schema'

import type { StockAdjustmentFormValues } from '../model/schema'

interface IAdjustStockDialogProps {
  branchId: number
  warehouseId: number
  preselectedItemId?: number
  preselectedItemName?: string
  trigger?: React.ReactNode
}

export const AdjustStockDialog = ({
  branchId,
  warehouseId,
  preselectedItemId,
  preselectedItemName,
  trigger,
}: IAdjustStockDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: adjustStock, isPending } = useAdjustStock()

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      inventoryItemId: preselectedItemId || 0,
      quantity: 0,
      reason: '',
    },
  })

  const onSubmit = (data: StockAdjustmentFormValues) => {
    adjustStock(
      {
        warehouseId,
        itemId: data.inventoryItemId,
        newQuantity: data.quantity,
        reason: data.reason,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  const quantity = form.watch('quantity')
  const isPositive = quantity > 0
  const isNegative = quantity < 0

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <IconAdjustmentsHorizontal className="mr-2 h-4 w-4" />
            Корректировка
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Корректировка остатков</DialogTitle>
          <DialogDescription>
            Положительное значение увеличит остаток, отрицательное — уменьшит
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inventoryItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Товар</FormLabel>
                  <FormControl>
                    {preselectedItemId && preselectedItemName ? (
                      <Input value={preselectedItemName} disabled />
                    ) : (
                      <ItemSelector
                        value={field.value || undefined}
                        onValueChange={(id) => field.onChange(id)}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Введите количество (+ или -)"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        isPositive
                          ? 'border-green-500 focus-visible:ring-green-500'
                          : isNegative
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {isPositive && (
                      <span className="text-green-600">
                        Остаток будет увеличен на {quantity}
                      </span>
                    )}
                    {isNegative && (
                      <span className="text-red-600">
                        Остаток будет уменьшен на {Math.abs(quantity)}
                      </span>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина корректировки</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Опишите причину корректировки..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Применить корректировку'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
