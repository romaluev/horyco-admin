'use client'

import { useState } from 'react'

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

import { useGetInventoryItems } from '@/entities/inventory/inventory-item/model/queries'
import { useAddPOItem } from '@/entities/inventory/purchase-order/model/mutations'

const addItemSchema = z.object({
  itemId: z.string().min(1, 'Выберите товар'),
  quantityOrdered: z.number().min(0.01, 'Количество должно быть больше 0'),
  unit: z.string().min(1, 'Укажите единицу'),
  unitPrice: z.number().min(0, 'Укажите цену'),
  taxRate: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
})

type AddItemFormValues = z.infer<typeof addItemSchema>

interface AddPOItemDialogProps {
  orderId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddPOItemDialog({
  orderId,
  open,
  onOpenChange,
  onSuccess,
}: AddPOItemDialogProps) {
  const addItemMutation = useAddPOItem()
  const { data: items, isLoading: itemsLoading } = useGetInventoryItems({
    isActive: true,
  })

  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      itemId: '',
      quantityOrdered: 1,
      unit: '',
      unitPrice: 0,
      taxRate: 12,
      notes: '',
    },
  })

  const selectedItemId = form.watch('itemId')
  const selectedItem = items?.find((i) => i.id.toString() === selectedItemId)

  // Auto-fill unit when item is selected
  const handleItemChange = (itemId: string) => {
    form.setValue('itemId', itemId)
    const item = items?.find((i) => i.id.toString() === itemId)
    if (item) {
      form.setValue('unit', item.unit)
      if (item.taxRate) {
        form.setValue('taxRate', item.taxRate)
      }
    }
  }

  const handleSubmit = (values: AddItemFormValues) => {
    addItemMutation.mutate(
      {
        poId: orderId,
        data: {
          itemId: parseInt(values.itemId),
          quantityOrdered: values.quantityOrdered,
          unit: values.unit,
          unitPrice: values.unitPrice,
          taxRate: values.taxRate,
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
          <DialogTitle>Добавить товар</DialogTitle>
          <DialogDescription>
            Добавьте товар в заказ поставщику
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Товар</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={handleItemChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите товар" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {itemsLoading ? (
                        <SelectItem value="" disabled>
                          Загрузка...
                        </SelectItem>
                      ) : (
                        items?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name} ({item.unit})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantityOrdered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step="any"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="кг, шт, л" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена за единицу (UZS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="100"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>НДС (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step="1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечание</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Дополнительная информация" />
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
