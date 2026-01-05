'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus } from '@tabler/icons-react'
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

import { useCreateInventoryCount } from '@/entities/inventory-count'
import { WarehouseSelector } from '@/entities/warehouse'
import { CountType, COUNT_TYPE_LABELS } from '@/shared/types/inventory'

import { countFormSchema } from '../model/schema'

import type { CountFormValues } from '../model/schema'

interface ICreateCountDialogProps {
  branchId: number
}

export const CreateCountDialog = ({ branchId }: ICreateCountDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createCount, isPending } = useCreateInventoryCount()

  const form = useForm<CountFormValues>({
    resolver: zodResolver(countFormSchema),
    defaultValues: {
      warehouseId: 0,
      type: undefined,
      name: '',
      notes: '',
    },
  })

  const onSubmit = (data: CountFormValues) => {
    createCount(
      { branchId, data },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  const watchType = form.watch('type')

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Создать инвентаризацию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать инвентаризацию</DialogTitle>
          <DialogDescription>
            Выберите тип инвентаризации и укажите параметры
          </DialogDescription>
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
                    <Input placeholder="Инвентаризация декабрь 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="warehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Склад</FormLabel>
                    <FormControl>
                      <WarehouseSelector
                        branchId={branchId}
                        value={field.value || null}
                        onChange={(id) => field.onChange(id || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CountType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {COUNT_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchType === CountType.FULL && (
              <p className="text-sm text-muted-foreground">
                Полная инвентаризация включает все товары на складе
              </p>
            )}

            {watchType === CountType.CYCLE && (
              <p className="text-sm text-muted-foreground">
                Циклическая инвентаризация проверяет товары по категориям
              </p>
            )}

            {watchType === CountType.SPOT && (
              <p className="text-sm text-muted-foreground">
                Выборочная инвентаризация для отдельных товаров
              </p>
            )}

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
              {isPending ? 'Создание...' : 'Создать инвентаризацию'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
