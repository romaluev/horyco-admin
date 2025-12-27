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

import { useUpdateSupplier } from '@/entities/supplier'
import type { ISupplier } from '@/entities/supplier'

import { supplierFormSchema } from '../model/schema'

import type { SupplierFormValues } from '../model/schema'

interface IUpdateSupplierDialogProps {
  supplier: ISupplier
  trigger?: React.ReactNode
}

export const UpdateSupplierDialog = ({
  supplier,
  trigger,
}: IUpdateSupplierDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: updateSupplier, isPending } = useUpdateSupplier()

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: supplier.name,
      contactName: supplier.contactName || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      notes: supplier.notes || '',
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: supplier.name,
        contactName: supplier.contactName || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        address: supplier.address || '',
        notes: supplier.notes || '',
      })
    }
  }, [isOpen, supplier, form])

  const onSubmit = (data: SupplierFormValues) => {
    updateSupplier(
      { id: supplier.id, data },
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать поставщика</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название компании</FormLabel>
                  <FormControl>
                    <Input placeholder="ООО Поставщик" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Контактное лицо</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="+998 90 123 45 67" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="supplier@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Input placeholder="г. Ташкент, ул. Примерная, 1" {...field} />
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
                    <Textarea placeholder="Дополнительная информация..." rows={2} {...field} />
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
