/**
 * Create Modifier Dialog
 * Dialog for creating a new modifier within a group
 */

'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Switch } from '@/shared/ui/base/switch'
import { Textarea } from '@/shared/ui/base/textarea'

import { useCreateModifier } from '@/entities/menu/modifier-group'

import { modifierSchema, type ModifierFormValues } from '../model/contract'

interface CreateModifierDialogProps {
  modifierGroupId: number
  trigger?: React.ReactNode
}

export const CreateModifierDialog = ({
  modifierGroupId,
  trigger,
}: CreateModifierDialogProps) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('menu')
  const { mutate: createModifier, isPending } = useCreateModifier()

  const form = useForm<ModifierFormValues>({
    resolver: zodResolver(modifierSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      modifierGroupId,
      sortOrder: 0,
      isActive: true,
    },
  })

  const handleSubmit = (values: ModifierFormValues): void => {
    createModifier(values, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button size="sm">{t('modifiers.create.trigger')}</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('modifiers.create.title')}</DialogTitle>
          <DialogDescription>
            {t('modifiers.create.description')}
          </DialogDescription>
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
                  <FormLabel>{t('modifiers.create.form.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('modifiers.create.form.name.placeholder')}
                      {...field}
                    />
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
                  <FormLabel>
                    {t('modifiers.create.form.description.label')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'modifiers.create.form.description.placeholder'
                      )}
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
                  <FormLabel>
                    {t('modifiers.create.form.price.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('modifiers.create.form.price.placeholder')}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('modifiers.create.form.price.description')}
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
                  <FormLabel>
                    {t('modifiers.create.form.sortOrder.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('modifiers.create.form.sortOrder.description')}
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
                    <FormLabel>
                      {t('modifiers.create.form.isActive.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('modifiers.create.form.isActive.description')}
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t('modifiers.create.form.actions.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t('modifiers.create.form.actions.saving')
                  : t('modifiers.create.form.actions.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
