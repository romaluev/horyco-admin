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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useAddCountItem } from '@/entities/inventory/inventory-count/model/mutations'
import { useGetStock } from '@/entities/inventory/stock/model/queries'

const addItemSchema = z.object({
  itemId: z.string().min(1, 'Выберите товар'),
  countedQuantity: z.number().min(0, 'Количество не может быть отрицательным'),
})

type AddItemFormValues = z.infer<typeof addItemSchema>

interface AddCountItemDialogProps {
  countId: number
  warehouseId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddCountItemDialog({
  countId,
  warehouseId,
  open,
  onOpenChange,
  onSuccess,
}: AddCountItemDialogProps) {
  const addItemMutation = useAddCountItem()
  const { data: stockResponse, isLoading: stockLoading } = useGetStock({
    warehouseId,
  })
  const stockItems = stockResponse?.data || []

  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      itemId: '',
      countedQuantity: 0,
    },
  })

  const selectedItemId = form.watch('itemId')
  const selectedStock = stockItems.find(
    (s) => s.itemId.toString() === selectedItemId
  )

  const handleSubmit = (values: AddItemFormValues) => {
    const stockItem = stockItems.find(
      (s) => s.itemId.toString() === values.itemId
    )

    if (!stockItem) return

    addItemMutation.mutate(
      {
        countId,
        data: {
          itemId: parseInt(values.itemId),
          systemQuantity: stockItem.quantity,
          countedQuantity: values.countedQuantity,
          unitCost: stockItem.averageCost,
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
          <DialogTitle>Добавить товар в подсчёт</DialogTitle>
          <DialogDescription>
            Выберите товар и укажите подсчитанное количество
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Товар</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите товар" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {stockLoading ? (
                        <SelectItem value="" disabled>
                          Загрузка...
                        </SelectItem>
                      ) : (
                        stockItems.map((stock) => (
                          <SelectItem
                            key={stock.itemId}
                            value={stock.itemId.toString()}
                          >
                            {stock.item?.name || 'Товар'} (в наличии:{' '}
                            {stock.quantity})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedStock && (
              <div className="bg-muted space-y-1 rounded-md p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">В системе:</span>
                  <span>
                    {selectedStock.quantity} {selectedStock.item?.unit || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Средняя цена:</span>
                  <span>
                    {new Intl.NumberFormat('ru-RU', {
                      style: 'currency',
                      currency: 'UZS',
                      maximumFractionDigits: 0,
                    }).format(selectedStock.averageCost)}
                  </span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="countedQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Подсчитанное количество</FormLabel>
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={addItemMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={addItemMutation.isPending}>
                {addItemMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Добавить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
