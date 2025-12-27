'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useFieldArray, useForm } from 'react-hook-form'

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
import { ScrollArea } from '@/shared/ui/base/scroll-area'
import { Separator } from '@/shared/ui/base/separator'

import { useCreatePurchaseOrder } from '@/entities/purchase-order'
import { WarehouseSelector } from '@/entities/warehouse'
import { SupplierSelector } from '@/entities/supplier'
import { ItemSelector } from '@/entities/inventory-item'

import { purchaseOrderFormSchema } from '../model/schema'

import type { PurchaseOrderFormValues } from '../model/schema'

interface ICreatePODialogProps {
  branchId: number
}

export const CreatePODialog = ({ branchId }: ICreatePODialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createPO, isPending } = useCreatePurchaseOrder()

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderFormSchema),
    defaultValues: {
      warehouseId: 0,
      supplierId: 0,
      expectedDate: '',
      notes: '',
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const onSubmit = (data: PurchaseOrderFormValues) => {
    createPO(
      {
        branchId,
        supplierId: data.supplierId,
        warehouseId: data.warehouseId,
        expectedDate: data.expectedDate || undefined,
        notes: data.notes || undefined,
        items: data.items.map((item) => ({
          itemId: item.inventoryItemId,
          quantity: item.quantity,
          unit: 'pcs',
          unitPrice: item.unitPrice,
        })),
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  const addItem = () => {
    append({
      inventoryItemId: 0,
      quantity: 1,
      unitPrice: 0,
    })
  }

  // Calculate total
  const watchItems = form.watch('items')
  const total = watchItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Создать заказ
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Создать заказ поставщику</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поставщик</FormLabel>
                    <FormControl>
                      <SupplierSelector
                        value={field.value || undefined}
                        onValueChange={(id) => field.onChange(id)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Склад получения</FormLabel>
                    <FormControl>
                      <WarehouseSelector
                        branchId={branchId}
                        value={field.value || undefined}
                        onValueChange={(id) => field.onChange(id)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expectedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ожидаемая дата доставки</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Товары</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <IconPlus className="mr-1 h-3 w-3" />
                  Добавить
                </Button>
              </div>

              <ScrollArea className="h-[200px] rounded-md border p-4">
                {fields.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Добавьте товары в заказ
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-2 items-end"
                      >
                        <div className="col-span-5">
                          <FormField
                            control={form.control}
                            name={`items.${index}.inventoryItemId`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Товар</FormLabel>
                                )}
                                <FormControl>
                                  <ItemSelector
                                    value={field.value || undefined}
                                    onValueChange={(id) => field.onChange(id)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Кол-во</FormLabel>
                                )}
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0.001}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitPrice`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Цена</FormLabel>
                                )}
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2 text-right text-sm text-muted-foreground">
                          {index === 0 && (
                            <span className="block text-xs mb-2">Сумма</span>
                          )}
                          {(
                            (watchItems[index]?.quantity ?? 0) *
                            (watchItems[index]?.unitPrice ?? 0)
                          ).toLocaleString()}{' '}
                          сум
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-destructive"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {form.formState.errors.items && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items.message}
                </p>
              )}

              {fields.length > 0 && (
                <div className="flex justify-end pt-2 font-medium">
                  Итого: {total.toLocaleString()} сум
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать заказ'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
