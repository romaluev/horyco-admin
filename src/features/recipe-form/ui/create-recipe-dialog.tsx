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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { ScrollArea } from '@/shared/ui/base/scroll-area'
import { Separator } from '@/shared/ui/base/separator'

import { useCreateRecipe } from '@/entities/recipe'
import { ItemSelector } from '@/entities/inventory-item'
import { INVENTORY_UNITS, UNIT_LABELS, RecipeLinkType } from '@/shared/types/inventory'

import { recipeFormSchema } from '../model/schema'

import type { RecipeFormValues } from '../model/schema'

interface ICreateRecipeDialogProps {
  branchId: number
}

export const CreateRecipeDialog = ({ branchId }: ICreateRecipeDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createRecipe, isPending } = useCreateRecipe()

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: '',
      outputQuantity: 1,
      outputUnit: 'pcs',
      notes: '',
      ingredients: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'ingredients',
  })

  const onSubmit = (data: RecipeFormValues) => {
    createRecipe(
      {
        name: data.name,
        linkType: RecipeLinkType.ITEM,
        outputQuantity: data.outputQuantity,
        outputUnit: data.outputUnit,
        notes: data.notes || undefined,
        ingredients: data.ingredients.map((ing) => ({
          itemId: ing.inventoryItemId ?? 0,
          quantity: ing.quantity,
          unit: ing.unit,
          wasteFactor: ing.wastagePercent ? ing.wastagePercent / 100 : undefined,
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

  const addIngredient = () => {
    append({
      inventoryItemId: undefined,
      recipeId: undefined,
      quantity: 1,
      unit: 'g',
      wastagePercent: 0,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Создать техкарту
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Создать техкарту</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Название</FormLabel>
                    <FormControl>
                      <Input placeholder="Пицца Маргарита" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="outputQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Выход</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0.001}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
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
                    <FormLabel>Единица выхода</FormLabel>
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

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Ингредиенты</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addIngredient}
                >
                  <IconPlus className="mr-1 h-3 w-3" />
                  Добавить
                </Button>
              </div>

              <ScrollArea className="h-[250px] rounded-md border p-4">
                {fields.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Добавьте ингредиенты
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
                            name={`ingredients.${index}.inventoryItemId`}
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
                            name={`ingredients.${index}.quantity`}
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
                            name={`ingredients.${index}.unit`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Ед.</FormLabel>
                                )}
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
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
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`ingredients.${index}.wastagePercent`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Потери %</FormLabel>
                                )}
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    placeholder="0"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
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
              {form.formState.errors.ingredients && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.ingredients.message}
                </p>
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
                      placeholder="Инструкции по приготовлению..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать техкарту'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
