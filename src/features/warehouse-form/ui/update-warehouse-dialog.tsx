'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconEdit } from '@tabler/icons-react'
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

import { useUpdateWarehouse } from '@/entities/warehouse'
import type { IWarehouse } from '@/entities/warehouse'

import { warehouseFormSchema } from '../model/schema'

import type { WarehouseFormValues } from '../model/schema'

interface IUpdateWarehouseDialogProps {
  warehouse: IWarehouse
  trigger?: React.ReactNode
}

export const UpdateWarehouseDialog = ({
  warehouse,
  trigger,
}: IUpdateWarehouseDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: updateWarehouse, isPending } = useUpdateWarehouse()

  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseFormSchema),
    defaultValues: {
      name: warehouse.name,
      address: warehouse.address || '',
      notes: warehouse.notes || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: warehouse.name,
        address: warehouse.address || '',
        notes: warehouse.notes || '',
      })
    }
  }, [isOpen, warehouse, form])

  const onSubmit = (data: WarehouseFormValues) => {
    updateWarehouse(
      { id: warehouse.id, data },
      {
        onSuccess: () => {
          setIsOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon">
            <IconEdit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
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
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Основной склад" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="ул. Складская, 1" {...field} />
                  </FormControl>
                  <FormMessage />
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
                    <Textarea placeholder="Дополнительная информация..." rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
