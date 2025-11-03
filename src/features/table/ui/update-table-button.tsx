'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Switch } from '@/shared/ui/base/switch'

import { useGetAllHalls } from '@/entities/hall/model/queries'
import { useTableById } from '@/entities/table/model'
import { useUpdateTable } from '@/entities/table/model/mutations'
import { TABLE_SHAPES } from '@/features/table/model/constants'

import { tableSchema } from '../model/contract'

import type * as z from 'zod'

type FormValues = z.infer<typeof tableSchema>

export const UpdateTableButton = ({ id }: { id: number }) => {
  const [open, setOpen] = useState(false)
  const { data: table } = useTableById(id)
  const { mutate: updateTable, isPending } = useUpdateTable()
  const { data: halls } = useGetAllHalls()

  const form = useForm<FormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      name: table?.name,
      size: table?.size,
      shape: table?.shape,
      xPosition: table?.xPosition,
      yPosition: table?.yPosition,
      hallId: table?.hallId,
      isAvailable: !!table?.isAvailable,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: table?.name,
        size: table?.size,
        shape: table?.shape,
        xPosition: table?.xPosition,
        yPosition: table?.yPosition,
        hallId: table?.hallId,
        isAvailable: !!table?.isAvailable,
      })
    }
  }, [open, table, form])

  const onSubmit = (data: FormValues) => {
    if (table?.id) {
      updateTable(
        { id: table.id, data },
        {
          onSuccess: () => {
            toast.success('Стол успешно обновлен')
            setOpen(false)
          },
          onError: (error) => {
            toast.error(`Ошибка при обновлении стола: ${error.message}`)
          },
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Pen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Обновить стол</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер стола</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Размер</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="shape"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Форма</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Выберите форму" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TABLE_SHAPES.map((shape) => (
                          <SelectItem key={shape.value} value={shape.value}>
                            {shape.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="hallId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зал</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(+value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Выберите залл" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {halls?.items.map((hall) => (
                        <SelectItem key={hall.id} value={String(hall.id)}>
                          {hall.name}
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
              name="isAvailable"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Доступен</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Обновление...' : 'Обновить стол'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
