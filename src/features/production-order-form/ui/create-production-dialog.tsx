'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'

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

import { useCreateProductionOrder } from '@/entities/production-order'
import { useGetRecipes } from '@/entities/recipe'
import { WarehouseSelector } from '@/entities/warehouse'

import { productionOrderFormSchema } from '../model/schema'

import type { ProductionOrderFormValues } from '../model/schema'

interface ICreateProductionDialogProps {
  branchId: number
}

export const CreateProductionDialog = ({
  branchId,
}: ICreateProductionDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createProduction, isPending } = useCreateProductionOrder()
  const { data: recipesData, isLoading: recipesLoading } = useGetRecipes(
    {},
    { enabled: isOpen }
  )

  const form = useForm<ProductionOrderFormValues>({
    resolver: zodResolver(productionOrderFormSchema),
    defaultValues: {
      warehouseId: 0,
      recipeId: 0,
      quantity: 1,
      plannedDate: '',
      notes: '',
    },
  })

  const onSubmit = (data: ProductionOrderFormValues) => {
    createProduction(
      { branchId, data },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  const recipes = recipesData?.data || []

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Создать производство
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать производственный заказ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Склад</FormLabel>
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

            <FormField
              control={form.control}
              name="recipeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Техкарта</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? String(field.value) : ''}
                    disabled={recipesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            recipesLoading ? 'Загрузка...' : 'Выберите техкарту'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipes.map((recipe) => (
                        <SelectItem key={recipe.id} value={String(recipe.id)}>
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
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество</FormLabel>
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
                name="plannedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Плановая дата</FormLabel>
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
