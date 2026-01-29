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
import { Textarea } from '@/shared/ui/base/textarea'

import { useGetInventoryItems } from '@/entities/inventory/inventory-item'
import { useAddSupplierItem } from '@/entities/inventory/supplier/model/mutations'

const addItemSchema = z.object({
  itemId: z.string().min(1, 'Выберите товар'),
  supplierSku: z.string().optional(),
  unitPrice: z.number().min(0, 'Цена не может быть отрицательной'),
  minOrderQuantity: z.number().min(1, 'Минимум 1'),
  isPreferred: z.boolean(),
  notes: z.string().optional(),
})

type AddItemFormValues = z.infer<typeof addItemSchema>

interface AddSupplierItemDialogProps {
  supplierId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddSupplierItemDialog({
  supplierId,
  open,
  onOpenChange,
  onSuccess,
}: AddSupplierItemDialogProps) {
  const addMutation = useAddSupplierItem()
  const { data: items, isLoading: itemsLoading } = useGetInventoryItems()

  const form = useForm<AddItemFormValues>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      itemId: '',
      supplierSku: '',
      unitPrice: 0,
      minOrderQuantity: 1,
      isPreferred: false,
      notes: '',
    },
  })

  const handleSubmit = (values: AddItemFormValues) => {
    addMutation.mutate(
      {
        supplierId,
        data: {
          itemId: parseInt(values.itemId),
          supplierSku: values.supplierSku || undefined,
          unitPrice: values.unitPrice,
          minOrderQuantity: values.minOrderQuantity,
          isPreferred: values.isPreferred,
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
          <DialogTitle>Добавить товар в каталог</DialogTitle>
          <DialogDescription>
            Добавьте товар в каталог поставщика с указанием цены
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
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена за единицу (UZS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
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
                name="minOrderQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Мин. заказ</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
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
              name="supplierSku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Артикул поставщика</FormLabel>
                  <FormControl>
                    <Input placeholder="SKU у поставщика" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPreferred"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Предпочитаемый поставщик</FormLabel>
                    <FormDescription>
                      Помечает этого поставщика как основного для данного товара
                    </FormDescription>
                  </div>
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
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечания</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Дополнительная информация..."
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
                disabled={addMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending && (
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
