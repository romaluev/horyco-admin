/**
 * Create Modifier Group Dialog
 * Dialog for creating a new modifier group
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

import { useCreateModifierGroup } from '@/entities/menu/modifier-group'

import {
  modifierGroupSchema,
  type ModifierGroupFormValues,
} from '../model/contract'

interface CreateModifierGroupDialogProps {
  trigger?: React.ReactNode
}

export const CreateModifierGroupDialog = ({
  trigger,
}: CreateModifierGroupDialogProps) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation('menu')
  const { mutate: createGroup, isPending } = useCreateModifierGroup()

  const form = useForm<ModifierGroupFormValues>({
    resolver: zodResolver(modifierGroupSchema),
    defaultValues: {
      name: '',
      description: '',
      isRequired: false,
      minSelection: 0,
      maxSelection: 1,
      sortOrder: 0,
    },
  })

  const handleSubmit = (values: ModifierGroupFormValues): void => {
    createGroup(values, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{t('modifiers.groups.create.trigger')}</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('modifiers.groups.create.title')}</DialogTitle>
          <DialogDescription>
            {t('modifiers.groups.create.description')}
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
                  <FormLabel>
                    {t('modifiers.groups.create.form.name.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        'modifiers.groups.create.form.name.placeholder'
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('modifiers.groups.create.form.description.label')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'modifiers.groups.create.form.description.placeholder'
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('modifiers.groups.create.form.minSelection.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        'modifiers.groups.create.form.minSelection.description'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('modifiers.groups.create.form.maxSelection.label')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      {t(
                        'modifiers.groups.create.form.maxSelection.description'
                      )}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('modifiers.groups.create.form.sortOrder.label')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('modifiers.groups.create.form.sortOrder.description')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>
                      {t('modifiers.groups.create.form.isRequired.label')}
                    </FormLabel>
                    <FormDescription>
                      {t('modifiers.groups.create.form.isRequired.description')}
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
                {t('modifiers.groups.create.form.actions.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t('modifiers.groups.create.form.actions.saving')
                  : t('modifiers.groups.create.form.actions.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
