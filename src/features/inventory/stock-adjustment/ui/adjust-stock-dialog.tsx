'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconAdjustments } from '@tabler/icons-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Textarea } from '@/shared/ui/base/textarea'

import { useAdjustStock } from '@/entities/inventory/stock'
import { useGetWarehouses } from '@/entities/inventory/warehouse'
import { useGetInventoryItems } from '@/entities/inventory/inventory-item'

import { stockAdjustmentSchema, adjustmentReasons } from '../model/schema'

import type { StockAdjustmentFormValues } from '../model/schema'

interface IAdjustStockDialogProps {
  defaultWarehouseId?: number
  defaultItemId?: number
  trigger?: React.ReactNode
}

export const AdjustStockDialog = ({
  defaultWarehouseId,
  defaultItemId,
  trigger,
}: IAdjustStockDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: adjustStock, isPending } = useAdjustStock()
  const { data: warehouses } = useGetWarehouses()
  const { data: items } = useGetInventoryItems()

  const form = useForm<StockAdjustmentFormValues>({
    resolver: zodResolver(stockAdjustmentSchema),
    defaultValues: {
      warehouseId: defaultWarehouseId || undefined,
      itemId: defaultItemId || undefined,
      quantityChange: 0,
      reason: 'MANUAL_ADJUSTMENT',
      notes: '',
      referenceNumber: '',
    },
  })

  const onSubmit = (data: StockAdjustmentFormValues) => {
    adjustStock(data, {
      onSuccess: () => {
        setIsOpen(false)
        form.reset()
      },
    })
  }

  const quantityChange = form.watch('quantityChange')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <IconAdjustments className="mr-2 h-4 w-4" />
            Корректировка
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Корректировка остатка</DialogTitle>
          <DialogDescription>
            Введите количество для изменения. Положительное значение увеличит остаток,
            отрицательное — уменьшит.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Склад *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите склад" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {warehouses?.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={String(warehouse.id)}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Товар *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите товар" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items?.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name} ({item.sku || 'без SKU'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantityChange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изменение количества *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className={
                        quantityChange > 0
                          ? 'border-emerald-600 dark:border-emerald-500'
                          : quantityChange < 0
                            ? 'border-destructive'
                            : ''
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    {quantityChange > 0
                      ? `Добавить ${quantityChange} единиц`
                      : quantityChange < 0
                        ? `Убрать ${Math.abs(quantityChange)} единиц`
                        : 'Введите положительное или отрицательное число'}
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
                  <FormLabel>Причина *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите причину" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {adjustmentReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="referenceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер документа</FormLabel>
                  <FormControl>
                    <Input placeholder="INV-2024-001" {...field} />
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
                  <FormLabel>Примечание</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Причина корректировки..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Применить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
