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
import { useAddRecipeIngredient } from '@/entities/inventory/recipe/model/mutations'

const addIngredientSchema = z.object({
  itemId: z.string().min(1, 'Выберите товар'),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unit: z.string().min(1, 'Укажите единицу измерения'),
  wasteFactor: z.number().min(1, 'Коэффициент потерь должен быть >= 1'),
  isOptional: z.boolean(),
  sortOrder: z.number().min(0),
  notes: z.string().optional(),
})

type AddIngredientFormValues = z.infer<typeof addIngredientSchema>

interface AddIngredientDialogProps {
  recipeId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddIngredientDialog({
  recipeId,
  open,
  onOpenChange,
  onSuccess,
}: AddIngredientDialogProps) {
  const addMutation = useAddRecipeIngredient()
  const { data: items, isLoading: itemsLoading } = useGetInventoryItems()

  const form = useForm<AddIngredientFormValues>({
    resolver: zodResolver(addIngredientSchema),
    defaultValues: {
      itemId: '',
      quantity: 1,
      unit: '',
      wasteFactor: 1,
      isOptional: false,
      sortOrder: 0,
      notes: '',
    },
  })

  const selectedItemId = form.watch('itemId')
  const selectedItem = items?.find((i) => i.id.toString() === selectedItemId)

  // Auto-fill unit when item is selected
  const handleItemChange = (value: string) => {
    form.setValue('itemId', value)
    const item = items?.find((i) => i.id.toString() === value)
    if (item?.unit) {
      form.setValue('unit', item.unit)
    }
  }

  const handleSubmit = (values: AddIngredientFormValues) => {
    addMutation.mutate(
      {
        recipeId,
        data: {
          itemId: parseInt(values.itemId),
          quantity: values.quantity,
          unit: values.unit,
          wasteFactor: values.wasteFactor,
          isOptional: values.isOptional,
          sortOrder: values.sortOrder,
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить ингредиент</DialogTitle>
          <DialogDescription>
            Выберите товар и укажите количество для техкарты
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
                  <Select value={field.value} onValueChange={handleItemChange}>
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество</FormLabel>
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

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица</FormLabel>
                    <FormControl>
                      <Input placeholder="кг, л, шт..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="wasteFactor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Коэффициент потерь</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        step="any"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      1.0 = 0%, 1.1 = 10% потерь
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Порядок</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isOptional"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Опциональный</FormLabel>
                    <FormDescription>
                      Опциональные ингредиенты можно пропустить при производстве
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
