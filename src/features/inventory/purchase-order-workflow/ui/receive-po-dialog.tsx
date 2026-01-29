'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/shared/ui/base/button'
import { DatePicker } from '@/shared/ui/base/date-picker'
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
import { Label } from '@/shared/ui/base/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'
import { Textarea } from '@/shared/ui/base/textarea'

import { useReceivePurchaseOrder } from '@/entities/inventory/purchase-order/model/mutations'

import type {
  IPurchaseOrder,
  IPurchaseOrderItem,
} from '@/entities/inventory/purchase-order/model/types'

const receiveSchema = z.object({
  receiveDate: z.date({ required_error: 'Укажите дату приёмки' }),
  notes: z.string().optional(),
})

type ReceiveFormValues = z.infer<typeof receiveSchema>

interface ReceivePODialogProps {
  order: IPurchaseOrder
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ReceivePODialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: ReceivePODialogProps) {
  const receiveMutation = useReceivePurchaseOrder()

  // Track quantities for each item
  const [quantities, setQuantities] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {}
    order.items?.forEach((item) => {
      const remaining = item.quantityOrdered - item.quantityReceived
      initial[item.id] = remaining > 0 ? remaining : 0
    })
    return initial
  })

  const form = useForm<ReceiveFormValues>({
    resolver: zodResolver(receiveSchema),
    defaultValues: {
      receiveDate: new Date(),
      notes: '',
    },
  })

  const handleQuantityChange = (itemId: number, value: string) => {
    const numValue = parseFloat(value) || 0
    setQuantities((prev) => ({ ...prev, [itemId]: numValue }))
  }

  const handleSubmit = (values: ReceiveFormValues) => {
    const itemsToReceive = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([itemId, qty]) => ({
        poItemId: parseInt(itemId),
        quantityReceived: qty,
      }))

    if (itemsToReceive.length === 0) {
      return
    }

    receiveMutation.mutate(
      {
        id: order.id,
        data: {
          receiveDate: format(values.receiveDate, 'yyyy-MM-dd'),
          notes: values.notes || undefined,
          items: itemsToReceive,
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

  const totalReceiving = Object.values(quantities).reduce(
    (sum, qty) => sum + qty,
    0
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Приём товаров</DialogTitle>
          <DialogDescription>
            Укажите количество принимаемых товаров по заказу {order.poNumber}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="receiveDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата приёмки</FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={(dateStr) =>
                        field.onChange(dateStr ? new Date(dateStr) : undefined)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="max-h-[300px] overflow-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Товар</TableHead>
                    <TableHead className="text-right">Заказано</TableHead>
                    <TableHead className="text-right">Уже получено</TableHead>
                    <TableHead className="text-right">Осталось</TableHead>
                    <TableHead className="w-[120px] text-right">
                      Принять
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item) => {
                    const remaining =
                      item.quantityOrdered - item.quantityReceived
                    const isFullyReceived = remaining <= 0

                    return (
                      <TableRow
                        key={item.id}
                        className={isFullyReceived ? 'opacity-50' : ''}
                      >
                        <TableCell>
                          <span className="font-medium">{item.itemName}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantityOrdered} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantityReceived} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          {remaining > 0 ? remaining : 0} {item.unit}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            max={remaining > 0 ? remaining : 0}
                            step="any"
                            value={quantities[item.id] || 0}
                            onChange={(e) =>
                              handleQuantityChange(item.id, e.target.value)
                            }
                            disabled={isFullyReceived}
                            className="h-8 w-full text-right"
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Комментарий к приёмке..."
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
                disabled={receiveMutation.isPending}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={receiveMutation.isPending || totalReceiving === 0}
              >
                {receiveMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Принять товары
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
