'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import { useFieldArray, useForm } from 'react-hook-form'

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
import { ScrollArea } from '@/shared/ui/base/scroll-area'
import { Separator } from '@/shared/ui/base/separator'

import { useCreateWriteoff } from '@/entities/writeoff'
import { WarehouseSelector } from '@/entities/warehouse'
import { ItemSelector } from '@/entities/inventory-item'
import {
  WriteoffReason,
  WRITEOFF_REASON_LABELS,
} from '@/shared/types/inventory'

import { writeoffFormSchema } from '../model/schema'

import type { WriteoffFormValues } from '../model/schema'

interface ICreateWriteoffDialogProps {
  branchId: number
}

export const CreateWriteoffDialog = ({ branchId }: ICreateWriteoffDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { mutate: createWriteoff, isPending } = useCreateWriteoff()

  const form = useForm<WriteoffFormValues>({
    resolver: zodResolver(writeoffFormSchema),
    defaultValues: {
      warehouseId: 0,
      reason: undefined,
      notes: '',
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const onSubmit = (data: WriteoffFormValues) => {
    createWriteoff(
      { branchId, data },
      {
        onSuccess: () => {
          setIsOpen(false)
          form.reset()
        },
      }
    )
  }

  const addItem = () => {
    append({
      inventoryItemId: 0,
      quantity: 1,
      unitCost: undefined,
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
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Создать списание</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Причина</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите причину" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(WriteoffReason).map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {WRITEOFF_REASON_LABELS[reason]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel>Товары для списания</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addItem}
                >
                  <IconPlus className="mr-1 h-3 w-3" />
                  Добавить
                </Button>
              </div>

              <ScrollArea className="h-[200px] rounded-md border p-4">
                {fields.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    Добавьте товары для списания
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="grid grid-cols-12 gap-2 items-end"
                      >
                        <div className="col-span-6">
                          <FormField
                            control={form.control}
                            name={`items.${index}.inventoryItemId`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Товар</FormLabel>
                                )}
                                <FormControl>
                                  <ItemSelector
                                    value={field.value || undefined}
                                    onValueChange={(id) => field.onChange(id)}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-2">
                          <FormField
                            control={form.control}
                            name={`items.${index}.quantity`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">Кол-во</FormLabel>
                                )}
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0.001}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-3">
                          <FormField
                            control={form.control}
                            name={`items.${index}.unitCost`}
                            render={({ field }) => (
                              <FormItem>
                                {index === 0 && (
                                  <FormLabel className="text-xs">
                                    Себестоимость
                                  </FormLabel>
                                )}
                                <FormControl>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    min={0}
                                    placeholder="Авто"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value
                                          ? Number(e.target.value)
                                          : undefined
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-destructive"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              {form.formState.errors.items && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items.message}
                </p>
              )}
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
              {isPending ? 'Создание...' : 'Создать списание'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
