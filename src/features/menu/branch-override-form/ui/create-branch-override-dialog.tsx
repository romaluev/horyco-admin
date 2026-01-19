/**
 * Create Branch Override Dialog
 * Dialog for creating branch-specific product overrides
 */

'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'

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
  FormDescription,
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
import { Switch } from '@/shared/ui/base/switch'

import { useUpsertBranchOverride } from '@/entities/menu/branch-override'

import {
  upsertBranchOverrideFormSchema,
  type UpsertBranchOverrideFormValues,
} from '../model/contract'

interface CreateBranchOverrideDialogProps {
  productId?: number
  branchId?: number
  products?: { id: number; name: string; price: number }[]
  branches?: { id: number; name: string }[]
}

export const CreateBranchOverrideDialog = ({
  productId,
  branchId,
  products = [],
  branches = [],
}: CreateBranchOverrideDialogProps) => {
  const [open, setOpen] = useState(false)
  const { mutate: upsertOverride, isPending } = useUpsertBranchOverride()

  const form = useForm<UpsertBranchOverrideFormValues>({
    resolver: zodResolver(upsertBranchOverrideFormSchema),
    defaultValues: {
      productId: productId || undefined,
      branchId: branchId || undefined,
      overridePrice: undefined,
      overrideAvailability: undefined,
    },
  })

  const onSubmit = (data: UpsertBranchOverrideFormValues): void => {
    if (!data.productId || !data.branchId) {
      return
    }

    upsertOverride(
      {
        productId: data.productId,
        branchId: data.branchId,
        data: {
          overridePrice: data.overridePrice,
          overrideAvailability: data.overrideAvailability,
          overrideImage: data.overrideImage,
          overrideName: data.overrideName,
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          form.reset()
        },
      }
    )
  }

  const selectedProduct = products.find((p) => p.id === form.watch('productId'))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить переопределение
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новое переопределение для филиала</DialogTitle>
          <DialogDescription>
            Задайте индивидуальные настройки продукта для филиала
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!productId && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Продукт</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите продукт" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name} (базовая цена: {product.price} сум)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {!branchId && (
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Филиал</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите филиал" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id.toString()}
                          >
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="overridePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена для филиала</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        selectedProduct
                          ? `Базовая: ${selectedProduct.price}`
                          : 'Введите цену'
                      }
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value ? Number(value) : null)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Оставьте пустым, чтобы использовать базовую цену
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overrideAvailability"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Доступность</FormLabel>
                    <FormDescription>
                      Переопределить доступность для этого филиала
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? undefined}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
