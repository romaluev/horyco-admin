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
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/base/table'

import { useStartProduction } from '@/entities/inventory/production-order/model/mutations'

import type { IProductionOrder } from '@/entities/inventory/production-order/model/types'

interface StartProductionDialogProps {
  order: IProductionOrder
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function StartProductionDialog({
  order,
  open,
  onOpenChange,
  onSuccess,
}: StartProductionDialogProps) {
  const startMutation = useStartProduction()

  // Build schema dynamically based on ingredients
  const ingredientSchema = z.object(
    (order.ingredients ?? []).reduce(
      (acc, ing) => {
        acc[`ingredient_${ing.itemId}`] = z
          .number()
          .min(0, 'Количество не может быть отрицательным')
        return acc
      },
      {} as Record<string, z.ZodNumber>
    )
  )

  type FormValues = z.infer<typeof ingredientSchema>

  const form = useForm<FormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: (order.ingredients ?? []).reduce(
      (acc, ing) => {
        acc[`ingredient_${ing.itemId}`] = ing.plannedQuantity
        return acc
      },
      {} as Record<string, number>
    ),
  })

  const handleSubmit = (values: FormValues) => {
    const actualIngredients = Object.entries(values).map(([key, value]) => ({
      itemId: parseInt(key.replace('ingredient_', '')),
      actualQuantity: value as number,
    }))

    startMutation.mutate(
      {
        id: order.id,
        data: { actualIngredients },
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Начать производство</DialogTitle>
          <DialogDescription>
            Укажите фактическое количество ингредиентов. Товары будут списаны со
            склада.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-muted rounded-md p-3 text-sm space-y-1 mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Продукт:</span>
            <span className="font-medium">{order.outputItemName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Плановое количество:</span>
            <span className="font-medium">
              {order.plannedQuantity} {order.outputUnit}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="rounded-md border max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ингредиент</TableHead>
                    <TableHead className="text-right">План</TableHead>
                    <TableHead className="text-right w-[150px]">
                      Факт. количество
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(order.ingredients ?? []).map((ingredient) => (
                    <TableRow key={ingredient.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{ingredient.itemName}</p>
                          <p className="text-sm text-muted-foreground">
                            {ingredient.itemUnit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {ingredient.plannedQuantity}
                      </TableCell>
                      <TableCell>
                        <FormField
                          control={form.control}
                          name={`ingredient_${ingredient.itemId}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  step="any"
                                  className="text-right"
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={startMutation.isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={startMutation.isPending}>
                {startMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Начать производство
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
