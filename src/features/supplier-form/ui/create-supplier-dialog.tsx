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

import { useCreateSupplier } from '@/entities/supplier'

import { supplierFormSchema } from '../model/schema'

import type { SupplierFormValues } from '../model/schema'

interface ICreateSupplierDialogProps {
  branchId: number
}

export const CreateSupplierDialog = ({ branchId }: ICreateSupplierDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createSupplier, isPending } = useCreateSupplier()

  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      contactName: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    },
  })

  const onSubmit = (data: SupplierFormValues) => {
    createSupplier(
      {
        name: data.name,
        contactName: data.contactName || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined,
        address: data.address || undefined,
        notes: data.notes || undefined,
      },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Добавить поставщика
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить поставщика</DialogTitle>
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
              {isPending ? 'Создание...' : 'Добавить поставщика'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
