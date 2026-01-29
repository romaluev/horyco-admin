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
import { Textarea } from '@/shared/ui/base/textarea'

import { useGetStock } from '@/entities/inventory/stock/model/queries'
import { useAddWriteoffItem } from '@/entities/inventory/writeoff/model/mutations'

const addItemSchema = z.object({
  itemId: z.string().min(1, 'Выберите товар'),
  quantity: z.number().min(0.01, 'Количество должно быть больше 0'),
  notes: z.string().optional(),
})

type AddItemFormValues = z.infer<typeof addItemSchema>

interface AddWriteoffItemDialogProps {
  writeoffId: number
  warehouseId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddWriteoffItemDialog({
  writeoffId,
  warehouseId,
  open,
  onOpenChange,
  onSuccess,
}: AddWriteoffItemDialogProps) {
  const addItemMutation = useAddWriteoffItem()
  const { data: stockResponse, isLoading: stockLoading } = useGetStock({
    warehouseId,
  })
  const stockItems = stockResponse?.data || []

  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      itemId: '',
      quantity: 0,
      notes: '',
    },
  })

  const selectedItemId = form.watch('itemId')
  const selectedStock = stockItems.find(
    (s) => s.itemId.toString() === selectedItemId
  )

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: 0,
    }).format(value)

  const handleSubmit = (values: AddItemFormValues) => {
    addItemMutation.mutate(
      {
        writeoffId,
        data: {
          itemId: parseInt(values.itemId),
          quantity: values.quantity,
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
          <DialogTitle>Добавить товар в списание</DialogTitle>
          <DialogDescription>
            Выберите товар со склада и укажите количество для списания
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
                  <span className="text-muted-foreground">В наличии:</span>
                  <span>
                    {selectedStock.quantity} {selectedStock.item?.unit || ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Средняя цена:</span>
                  <span>{formatCurrency(selectedStock.averageCost)}</span>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Количество для списания</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={selectedStock?.quantity ?? 999999}
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

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечание (необязательно)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация о товаре..."
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
