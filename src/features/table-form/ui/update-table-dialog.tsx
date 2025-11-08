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

import { useUpdateTable } from '@/entities/table'

import { tableFormSchema, tableShapes } from '../model/schema'

import type { TableFormValues } from '../model/schema'
import type { ITable } from '@/entities/table'

interface IUpdateTableDialogProps {
  table: ITable
  isOpen: boolean
  onClose: () => void
}

export const UpdateTableDialog = ({
  table,
  isOpen,
  onClose,
}: IUpdateTableDialogProps) => {
  const { mutate: updateTable, isPending } = useUpdateTable()

  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: {
      hallId: table.hallId,
      number: table.number,
      capacity: table.capacity,
      shape: table.shape,
      xPosition: table.xPosition ?? 500,
      yPosition: table.yPosition ?? 300,
      rotation: table.rotation ?? 0,
    },
  })

  useEffect(() => {
    if (isOpen) {
      form.reset({
        hallId: table.hallId,
        number: table.number,
        capacity: table.capacity,
        shape: table.shape,
        xPosition: table.xPosition ?? 500,
        yPosition: table.yPosition ?? 300,
        rotation: table.rotation ?? 0,
      })
    }
  }, [isOpen, table, form])

  const onSubmit = (data: TableFormValues) => {
    updateTable(
      {
        id: table.id,
        data: {
          number: data.number,
          capacity: data.capacity,
          shape: data.shape,
        },
      },
      {
        onSuccess: () => {
          onClose()
        },
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать стол {table.number}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер стола *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="1"
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
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вместимость *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      placeholder="4"
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
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shape</FormLabel>
                  <div className="flex gap-2">
                    {tableShapes.map((shape) => (
                      <Button
                        key={shape.value}
                        type="button"
                        variant={field.value === shape.value ? 'default' : 'outline'}
                        className="flex-1"
                        onClick={() => field.onChange(shape.value)}
                      >
                        {shape.label}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
