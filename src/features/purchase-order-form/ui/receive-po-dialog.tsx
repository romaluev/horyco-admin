'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPackageImport } from '@tabler/icons-react'
import { useForm, useFieldArray } from 'react-hook-form'

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'
import { ScrollArea } from '@/shared/ui/base/scroll-area'

import { useReceiveItems } from '@/entities/purchase-order'
import type { IPurchaseOrderItem } from '@/entities/purchase-order'

import { receivePOFormSchema } from '../model/schema'

import type { ReceivePOFormValues } from '../model/schema'

interface IReceivePODialogProps {
  poId: number
  items: IPurchaseOrderItem[]
  onSuccess?: () => void
}

export const ReceivePODialog = ({
  poId,
  items,
  onSuccess,
}: IReceivePODialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: receiveItems, isPending } = useReceiveItems()

  const form = useForm<ReceivePOFormValues>({
    resolver: zodResolver(receivePOFormSchema),
    defaultValues: {
      receiveDate: new Date().toISOString().split('T')[0],
      items: items.map((item) => ({
        itemId: item.id,
        receivedQuantity: item.quantity - (item.receivedQuantity || 0),
      })),
      notes: '',
    },
  })

  const { fields } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const onSubmit = (data: ReceivePOFormValues) => {
    receiveItems(
      {
        id: poId,
        data: {
          receiveDate: data.receiveDate,
          notes: data.notes,
          items: data.items.map((item) => ({
            poItemId: item.itemId,
            quantityReceived: item.receivedQuantity,
          })),
        },
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <IconPackageImport className="mr-2 h-4 w-4" />
          Принять товар
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Приёмка товара</DialogTitle>
          <DialogDescription>
            Укажите количество принятого товара по каждой позиции
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const item = items.find((i) => i.id === field.itemId)
                  if (!item) return null

                  const remaining = item.quantity - (item.receivedQuantity || 0)

                  return (
                    <div
                      key={field.id}
                      className="grid grid-cols-12 gap-4 items-center"
                    >
                      <div className="col-span-5">
                        <p className="font-medium text-sm">{item.inventoryItemName}</p>
                        <p className="text-xs text-muted-foreground">
                          Заказано: {item.quantity} {item.unit} | Осталось:{' '}
                          {remaining} {item.unit}
                        </p>
                      </div>
                      <div className="col-span-4">
                        <FormField
                          control={form.control}
                          name={`items.${index}.receivedQuantity`}
                          render={({ field: inputField }) => (
                            <FormItem>
                              {index === 0 && (
                                <FormLabel className="text-xs">
                                  Принято
                                </FormLabel>
                              )}
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min={0}
                                  max={remaining}
                                  {...inputField}
                                  onChange={(e) =>
                                    inputField.onChange(Number(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-3 text-right text-sm">
                        {item.unit}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Заметки о приёмке..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Приёмка...' : 'Подтвердить приёмку'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
