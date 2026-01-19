'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'

import { useUpdateRecipe } from '@/entities/inventory/recipe/model/mutations'
import type { IRecipe } from '@/entities/inventory/recipe/model/types'

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

const editRecipeSchema = z.object({
  name: z.string().min(1, 'Введите название'),
  outputQuantity: z.number().min(0.01, 'Количество должно быть больше 0'),
  outputUnit: z.string().optional(),
  prepTimeMinutes: z.number().optional(),
  isActive: z.boolean(),
  notes: z.string().optional(),
})

type EditRecipeFormValues = z.infer<typeof editRecipeSchema>

interface EditRecipeDialogProps {
  recipe: IRecipe
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditRecipeDialog({
  recipe,
  open,
  onOpenChange,
  onSuccess,
}: EditRecipeDialogProps) {
  const updateMutation = useUpdateRecipe()

  const form = useForm<EditRecipeFormValues>({
    resolver: zodResolver(editRecipeSchema),
    defaultValues: {
      name: recipe.name,
      outputQuantity: recipe.outputQuantity,
      outputUnit: recipe.outputUnit || '',
      prepTimeMinutes: recipe.prepTimeMinutes || undefined,
      isActive: recipe.isActive,
      notes: recipe.notes || '',
    },
  })

  const handleSubmit = (values: EditRecipeFormValues) => {
    updateMutation.mutate(
      {
        id: recipe.id,
        data: {
          name: values.name,
          outputQuantity: values.outputQuantity,
          outputUnit: values.outputUnit || undefined,
          prepTimeMinutes: values.prepTimeMinutes || undefined,
          isActive: values.isActive,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать техкарту</DialogTitle>
          <DialogDescription>
            Измените параметры техкарты
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
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
                name="outputQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество выхода</FormLabel>
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
                name="outputUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица измерения</FormLabel>
                    <FormControl>
                      <Input placeholder="шт, кг, л..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="prepTimeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Время приготовления (мин)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
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
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Активна</FormLabel>
                    <FormDescription>
                      Неактивные техкарты не отображаются при создании
                      производства
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
