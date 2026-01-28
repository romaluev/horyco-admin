'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
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
import { Switch } from '@/shared/ui/base/switch'

import { useUpdateWarehouse } from '@/entities/inventory/warehouse'
import { warehouseFormSchema } from '../model/schema'

import type { IWarehouse } from '@/entities/inventory/warehouse'
import type { WarehouseFormValues } from '../model/schema'

interface UpdateWarehouseDialogProps {
  warehouse: IWarehouse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateWarehouseDialog({
  warehouse,
  open,
  onOpenChange,
}: UpdateWarehouseDialogProps) {
  const { mutate: updateWarehouse, isPending } = useUpdateWarehouse()

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: warehouse.name,
      code: warehouse.code || '',
      branchId: warehouse.branchId,
      isActive: warehouse.isActive,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: warehouse.name,
        code: warehouse.code || '',
        branchId: warehouse.branchId,
        isActive: warehouse.isActive,
      })
    }
  }, [open, warehouse, form])

  const onSubmit = (data: WarehouseFormValues) => {
    updateWarehouse(
      {
        id: warehouse.id,
        data: {
          name: data.name,
          code: data.code || undefined,
          isActive: data.isActive,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать склад</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input placeholder="Основной склад" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Код</FormLabel>
                  <FormControl>
                    <Input placeholder="WH-001" {...field} />
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
                    <FormLabel>Активен</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
