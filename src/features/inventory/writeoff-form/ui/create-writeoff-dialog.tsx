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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Textarea } from '@/shared/ui/base/textarea'

import { WarehouseSelector } from '@/entities/inventory/warehouse'
import { useCreateWriteoff } from '@/entities/inventory/writeoff'

import { writeoffFormSchema, writeoffReasonOptions } from '../model/schema'

import type { WriteoffFormValues } from '../model/schema'

export function CreateWriteoffDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createWriteoff, isPending } = useCreateWriteoff()

  const form = useForm<WriteoffFormValues>({
    resolver: zodResolver(writeoffFormSchema),
    defaultValues: {
      warehouseId: undefined,
      reason: undefined,
      notes: '',
    },
  })

  const onSubmit = (data: WriteoffFormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== '' && value !== undefined)
    ) as WriteoffFormValues

    createWriteoff(cleanData, {
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
          Создать списание
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Создать списание</DialogTitle>
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
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Причина *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите причину" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {writeoffReasonOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    <Textarea
                      placeholder="Описание причины списания..."
                      {...field}
                      value={field.value ?? ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
