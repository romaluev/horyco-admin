'use client'

import { useEffect } from 'react'

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
  FormDescription,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Switch } from '@/shared/ui/base/switch'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/ui/base/tabs'
import { Textarea } from '@/shared/ui/base/textarea'

import { useUpdateInventoryItem } from '@/entities/inventory/inventory-item/model/mutations'

import type { IInventoryItem } from '@/entities/inventory/inventory-item/model/types'

const categoryOptions = [
  { value: 'raw_materials', label: 'Сырьё' },
  { value: 'packaging', label: 'Упаковка' },
  { value: 'semi_finished', label: 'Полуфабрикаты' },
  { value: 'finished_goods', label: 'Готовая продукция' },
  { value: 'consumables', label: 'Расходные материалы' },
  { value: 'other', label: 'Прочее' },
]

const unitOptions = [
  { value: 'шт', label: 'Штуки (шт)' },
  { value: 'кг', label: 'Килограммы (кг)' },
  { value: 'г', label: 'Граммы (г)' },
  { value: 'л', label: 'Литры (л)' },
  { value: 'мл', label: 'Миллилитры (мл)' },
  { value: 'м', label: 'Метры (м)' },
  { value: 'уп', label: 'Упаковка (уп)' },
]

const editItemSchema = z.object({
  name: z.string().min(1, 'Введите название'),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1, 'Выберите единицу'),
  minStockLevel: z.number().min(0),
  maxStockLevel: z.number().optional(),
  reorderPoint: z.number().optional(),
  reorderQuantity: z.number().optional(),
  isActive: z.boolean(),
  isSemiFinished: z.boolean(),
  isTrackable: z.boolean(),
  shelfLifeDays: z.number().optional(),
  taxRate: z.number().min(0).max(100),
  notes: z.string().optional(),
})

type EditItemFormValues = z.infer<typeof editItemSchema>

interface EditItemDialogProps {
  item: IInventoryItem
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditItemDialog({
  item,
  open,
  onOpenChange,
  onSuccess,
}: EditItemDialogProps) {
  const updateMutation = useUpdateInventoryItem()

  const form = useForm<EditItemFormValues>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      name: item.name,
      sku: item.sku || '',
      barcode: item.barcode || '',
      category: item.category || '',
      unit: item.unit,
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel || undefined,
      reorderPoint: item.reorderPoint || undefined,
      reorderQuantity: item.reorderQuantity || undefined,
      isActive: item.isActive,
      isSemiFinished: item.isSemiFinished,
      isTrackable: item.isTrackable,
      shelfLifeDays: item.shelfLifeDays || undefined,
      taxRate: item.taxRate,
      notes: item.notes || '',
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: item.name,
        sku: item.sku || '',
        barcode: item.barcode || '',
        category: item.category || '',
        unit: item.unit,
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel || undefined,
        reorderPoint: item.reorderPoint || undefined,
        reorderQuantity: item.reorderQuantity || undefined,
        isActive: item.isActive,
        isSemiFinished: item.isSemiFinished,
        isTrackable: item.isTrackable,
        shelfLifeDays: item.shelfLifeDays || undefined,
        taxRate: item.taxRate,
        notes: item.notes || '',
      })
    }
  }, [open, item, form])

  const handleSubmit = (values: EditItemFormValues) => {
    updateMutation.mutate(
      {
        id: item.id,
        data: {
          name: values.name,
          sku: values.sku || undefined,
          barcode: values.barcode || undefined,
          category: values.category || undefined,
          unit: values.unit,
          minStockLevel: values.minStockLevel,
          maxStockLevel: values.maxStockLevel,
          reorderPoint: values.reorderPoint,
          reorderQuantity: values.reorderQuantity,
          isActive: values.isActive,
          isSemiFinished: values.isSemiFinished,
          isTrackable: values.isTrackable,
          shelfLifeDays: values.shelfLifeDays,
          taxRate: values.taxRate,
          notes: values.notes || undefined,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription>Измените параметры товара</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">Основное</TabsTrigger>
                <TabsTrigger value="stock">Запасы</TabsTrigger>
                <TabsTrigger value="extra">Дополнительно</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Название *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sku"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SKU</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Штрихкод</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категория</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите категорию" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                        <FormLabel>Единица *</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите единицу" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {unitOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="stock" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="minStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Мин. остаток</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormDescription>Уведомление при достижении</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxStockLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Макс. остаток</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reorderPoint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Точка заказа</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reorderQuantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Количество заказа</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="extra" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="taxRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Налоговая ставка (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="shelfLifeDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Срок годности (дней)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            value={field.value ?? ''}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>Активен</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isTrackable"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>Учёт</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isSemiFinished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <FormLabel>П/ф</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
