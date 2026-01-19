'use client'

import { useState, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconAlertTriangle, IconCheck } from '@tabler/icons-react'
import { format } from 'date-fns'
import { useForm, useWatch } from 'react-hook-form'

import { formatCurrency } from '@/shared/lib/format'
import { Alert, AlertDescription } from '@/shared/ui/base/alert'
import { Button } from '@/shared/ui/base/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/base/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Textarea } from '@/shared/ui/base/textarea'

import { useCreateProductionOrder } from '@/entities/production-order'
import { useGetRecipes, useRecipeById } from '@/entities/recipe'
import { useGetStock } from '@/entities/stock'
import { WarehouseSelector } from '@/entities/warehouse'

import { productionOrderFormSchema } from '../model/schema'

import type { ProductionOrderFormValues } from '../model/schema'

export function CreateProductionDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createProduction, isPending } = useCreateProductionOrder()
  const { data: recipes = [], isLoading: recipesLoading } = useGetRecipes({ isActive: true })

  const form = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: {
      warehouseId: undefined,
      recipeId: undefined,
      quantityPlanned: 1,
      plannedDate: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
    },
  })

  // Watch form values for ingredients preview
  const watchedRecipeId = useWatch({ control: form.control, name: 'recipeId' })
  const watchedWarehouseId = useWatch({ control: form.control, name: 'warehouseId' })
  const watchedQuantity = useWatch({ control: form.control, name: 'quantityPlanned' })

  // Fetch recipe details when selected
  const { data: selectedRecipe } = useRecipeById(watchedRecipeId ?? 0)

  // Fetch stock for the selected warehouse
  const { data: stockData } = useGetStock({ warehouseId: watchedWarehouseId })

  // Calculate required ingredients with availability
  const ingredientsWithAvailability = useMemo(() => {
    if (!selectedRecipe?.ingredients || !watchedQuantity) return []

    const outputQty = selectedRecipe.outputQuantity || 1
    const multiplier = watchedQuantity / outputQty
    const stockItems = stockData?.data ?? []

    return selectedRecipe.ingredients.map((ing) => {
      const requiredQty = ing.quantity * ing.wasteFactor * multiplier
      const stockItem = stockItems.find((s) => s.itemId === ing.itemId)
      const availableQty = stockItem?.quantity ?? 0
      const isSufficient = availableQty >= requiredQty

      return {
        ...ing,
        requiredQty,
        availableQty,
        isSufficient,
      }
    })
  }, [selectedRecipe, watchedQuantity, stockData])

  const hasInsufficientIngredients = ingredientsWithAvailability.some((i) => !i.isSufficient)

  const onSubmit = (data: ProductionOrderFormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
    ) as ProductionOrderFormValues

    createProduction(cleanData, {
      onSuccess: () => {
        setIsOpen(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Создать заказ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать заказ на производство</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Склад *</FormLabel>
                  <FormControl>
                    <WarehouseSelector
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Выберите склад"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recipeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Техкарта *</FormLabel>
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={field.value?.toString()}
                    disabled={recipesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={recipesLoading ? 'Загрузка...' : 'Выберите техкарту'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={recipe.id.toString()}>
                          {recipe.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantityPlanned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0.01}
                        step={0.01}
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
                name="plannedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>План. дата *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
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
                    <Textarea
                      placeholder="Комментарий..."
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Required Ingredients Preview */}
            {selectedRecipe && watchedWarehouseId && ingredientsWithAvailability.length > 0 && (
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">
                    Необходимые ингредиенты (для {watchedQuantity} {selectedRecipe.outputUnit || 'шт'})
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-0 pb-3">
                  {hasInsufficientIngredients && (
                    <Alert variant="destructive" className="mb-3">
                      <IconAlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Недостаточно ингредиентов на складе для производства
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    {ingredientsWithAvailability.map((ing) => (
                      <div
                        key={ing.itemId}
                        className="flex items-center justify-between text-sm border-b last:border-0 pb-2 last:pb-0"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{ing.itemName}</span>
                        </div>
                        <div className="flex items-center gap-4 text-right">
                          <div className="w-24">
                            <span className="text-muted-foreground">Нужно: </span>
                            <span>{ing.requiredQty.toFixed(2)}</span>
                          </div>
                          <div className="w-24">
                            <span className="text-muted-foreground">Есть: </span>
                            <span className={!ing.isSufficient ? 'text-destructive font-medium' : ''}>
                              {ing.availableQty.toFixed(2)}
                            </span>
                          </div>
                          <div className="w-6">
                            {ing.isSufficient ? (
                              <IconCheck className="h-4 w-4 text-green-600" />
                            ) : (
                              <IconAlertTriangle className="h-4 w-4 text-destructive" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRecipe.calculatedCost > 0 && (
                    <div className="mt-3 pt-3 border-t text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Расч. себестоимость:</span>
                        <span className="font-medium">
                          {formatCurrency((selectedRecipe.calculatedCost / selectedRecipe.outputQuantity) * watchedQuantity)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
