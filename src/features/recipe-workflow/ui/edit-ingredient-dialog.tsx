'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useUpdateRecipeIngredient } from '@/entities/recipe/model/mutations'
import type { IRecipeIngredient } from '@/entities/recipe/model/types'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import { Button } from '@/shared/ui/base/button'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'
import { Switch } from '@/shared/ui/base/switch'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/shared/ui/base/form'

const editIngredientSchema = z.object({
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unit: z.string().min(1, 'Укажите единицу измерения'),
  wasteFactor: z.number().min(1, 'Коэффициент потерь должен быть >= 1'),
  isOptional: z.boolean(),
  sortOrder: z.number().min(0),
  notes: z.string().optional(),
})

type EditIngredientFormValues = z.infer<typeof editIngredientSchema>

interface EditIngredientDialogProps {
  recipeId: number
  ingredient: IRecipeIngredient
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditIngredientDialog({
  recipeId,
  ingredient,
  open,
  onOpenChange,
  onSuccess,
}: EditIngredientDialogProps) {
  const updateMutation = useUpdateRecipeIngredient()

  const form = useForm<EditIngredientFormValues>({
    resolver: zodResolver(editIngredientSchema),
    defaultValues: {
      quantity: ingredient.quantity,
      unit: ingredient.unit,
      wasteFactor: ingredient.wasteFactor,
      isOptional: ingredient.isOptional,
      sortOrder: ingredient.sortOrder,
      notes: ingredient.notes || '',
    },
  })

  const handleSubmit = (values: EditIngredientFormValues) => {
    updateMutation.mutate(
      {
        recipeId,
        ingredientId: ingredient.id,
        data: {
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
          onSuccess?.()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать ингредиент</DialogTitle>
          <DialogDescription>
            {ingredient.itemName}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
