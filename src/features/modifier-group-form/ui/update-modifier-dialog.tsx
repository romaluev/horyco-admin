/**
 * Update Modifier Dialog
 * Dialog for updating an existing modifier
 */

'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Switch } from '@/shared/ui/base/switch'
import { Textarea } from '@/shared/ui/base/textarea'

import { useUpdateModifier } from '@/entities/modifier-group'

import { modifierSchema, type ModifierFormValues } from '../model/contract'

import type { IModifier } from '@/entities/modifier-group'

interface UpdateModifierDialogProps {
  modifier: IModifier
  isOpen: boolean
  onClose: () => void
}

export const UpdateModifierDialog = ({
  modifier,
  isOpen,
  onClose,
}: UpdateModifierDialogProps) => {
  const { mutate: updateModifier, isPending } = useUpdateModifier()

  const form = useForm<ModifierFormValues>({
    resolver: zodResolver(modifierSchema),
    defaultValues: {
      name: modifier.name,
      description: modifier.description || '',
      price: modifier.price,
      modifierGroupId: modifier.modifierGroupId,
      sortOrder: modifier.sortOrder || 0,
      isActive: modifier.isActive ?? true,
    },
  })

  // Reset form when modifier changes
  useEffect(() => {
    if (modifier) {
      form.reset({
        name: modifier.name,
        description: modifier.description || '',
        price: modifier.price,
        modifierGroupId: modifier.modifierGroupId,
        sortOrder: modifier.sortOrder || 0,
        isActive: modifier.isActive ?? true,
      })
    }
  }, [modifier, form])

  const handleSubmit = (values: ModifierFormValues): void => {
    updateModifier(
      { id: modifier.id, data: values },
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
          <DialogTitle>Редактировать модификатор</DialogTitle>
          <DialogDescription>Измените параметры модификатора</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Кетчуп" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Классический томатный кетчуп"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цена (UZS)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Дополнительная стоимость модификатора
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Порядок сортировки</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Порядок отображения модификатора в списке
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Активен</FormLabel>
                    <FormDescription>
                      Модификатор доступен для выбора
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Обновление...' : 'Обновить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
