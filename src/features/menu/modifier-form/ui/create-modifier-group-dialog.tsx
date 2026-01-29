/**
 * Create Modifier Group Dialog Component
 * Modal for creating new modifier groups
 */

'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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

import { useCreateModifierGroup } from '@/entities/menu/modifier-group'

import {
  modifierGroupFormSchema,
  type ModifierGroupFormValues,
} from '../model/contract'

interface CreateModifierGroupDialogProps {
  productId: number
  onSuccess?: () => void
}

export const CreateModifierGroupDialog = ({
  productId,
  onSuccess,
}: CreateModifierGroupDialogProps) => {
  const { t } = useTranslation('menu')
  const [open, setOpen] = useState(false)
  const { mutate: createGroup, isPending } = useCreateModifierGroup()

  const form = useForm<ModifierGroupFormValues>({
    resolver: zodResolver(modifierGroupFormSchema),
    defaultValues: {
      name: '',
      productId,
      minSelection: 0,
      maxSelection: 1,
      isRequired: false,
    },
  })

  const onSubmit = (data: ModifierGroupFormValues): void => {
    createGroup(data, {
      onSuccess: () => {
        setOpen(false)
        form.reset()
        onSuccess?.()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('components.modifierGroup.create.trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('components.modifierGroup.create.title')}</DialogTitle>
          <DialogDescription>
            {t('components.modifierGroup.create.description')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('components.modifierGroup.create.nameLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('components.modifierGroup.create.namePlaceholder')} {...field} />
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
                    <FormLabel>{t('components.modifierGroup.create.minLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {t('components.modifierGroup.create.minDescription')}
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
                    <FormLabel>{t('components.modifierGroup.create.maxLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      {t('components.modifierGroup.create.maxDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isRequired"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>{t('components.modifierGroup.create.requiredLabel')}</FormLabel>
                    <FormDescription>
                      {t('components.modifierGroup.create.requiredDescription')}
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
                disabled={isPending}
              >
                {t('components.modifierGroup.create.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('components.modifierGroup.create.submitting') : t('components.modifierGroup.create.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
