'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconEdit } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useUpdateInventoryItem } from '@/entities/inventory-item'
import type { IInventoryItem } from '@/entities/inventory-item'
import {
  ITEM_CATEGORIES,
  ITEM_CATEGORY_LABELS,
  INVENTORY_UNITS,
  UNIT_LABELS,
  type ItemCategory,
  type InventoryUnit,
} from '@/shared/types/inventory'

import { inventoryItemFormSchema } from '../model/schema'

import type { InventoryItemFormValues } from '../model/schema'

interface IUpdateItemDialogProps {
  item: IInventoryItem
  trigger?: React.ReactNode
}

export const UpdateItemDialog = ({ item, trigger }: IUpdateItemDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: updateItem, isPending } = useUpdateInventoryItem()

  const form = useForm<InventoryItemFormValues>({
    resolver: zodResolver(inventoryItemFormSchema),
    defaultValues: {
      name: item.name,
      sku: item.sku || '',
      category: item.category,
      unit: item.unit,
      minStock: item.minStock || 0,
      maxStock: item.maxStock || undefined,
      notes: item.notes || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: item.name,
        sku: item.sku || '',
        category: item.category,
        unit: item.unit,
        minStock: item.minStock || 0,
        maxStock: item.maxStock || undefined,
        notes: item.notes || '',
      })
    }
  }, [isOpen, item, form])

  const onSubmit = (data: InventoryItemFormValues) => {
    updateItem(
      {
        id: item.id,
        data: {
          name: data.name,
          category: data.category,
          unit: data.unit as InventoryUnit,
          sku: data.sku || undefined,
          minStockLevel: data.minStock,
          maxStockLevel: data.maxStock,
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Помидоры" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артикул (SKU)</FormLabel>
                  <FormControl>
                    <Input placeholder="TOM-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ITEM_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {ITEM_CATEGORY_LABELS[cat as ItemCategory]}
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
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INVENTORY_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {UNIT_LABELS[unit]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. остаток</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Макс. остаток</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
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
                  <FormLabel>Примечания</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Дополнительная информация..." rows={2} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
