/**
 * Edit Branch Override Dialog
 * Dialog for editing branch-specific product overrides
 */

'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

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

import {
  useUpsertBranchOverride,
  type IBranchOverride,
  type IUpsertBranchOverrideDto,
} from '@/entities/menu/branch-override'

interface EditBranchOverrideDialogProps {
  override: IBranchOverride
  basePrice?: number
}

// Form schema for just the override fields (not productId/branchId)
const editOverrideSchema = z.object({
  overridePrice: z
    .number({
      invalid_type_error: 'Введите корректную цену',
    })
    .min(0, 'Цена не может быть отрицательной')
    .nullable()
    .optional(),
  overrideAvailability: z.boolean().nullable().optional(),
})

type EditOverrideFormValues = z.infer<typeof editOverrideSchema>

export const EditBranchOverrideDialog = ({
  override,
  basePrice,
}: EditBranchOverrideDialogProps) => {
  const { t } = useTranslation('menu')
  const [open, setOpen] = useState(false)
  const { mutate: upsertOverride, isPending } = useUpsertBranchOverride()

  const form = useForm<EditOverrideFormValues>({
    resolver: zodResolver(editOverrideSchema),
    defaultValues: {
      overridePrice: override.overridePrice ?? undefined,
      overrideAvailability: override.overrideAvailability ?? undefined,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        overridePrice: override.overridePrice ?? undefined,
        overrideAvailability: override.overrideAvailability ?? undefined,
      })
    }
  }, [open, override, form])

  const onSubmit = (data: EditOverrideFormValues): void => {
    // ProductId might not be on override, extract it from the context
    const productId = override.productId
    if (!productId) {
      console.error('No productId on override')
      return
    }

    upsertOverride(
      {
        productId,
        branchId: override.branchId,
        data: data as IUpsertBranchOverrideDto,
      },
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('components.branchOverride.edit.title')}</DialogTitle>
          <DialogDescription>
            {override.productName && override.branchName
              ? `${override.productName} в ${override.branchName}`
              : t('components.branchOverride.edit.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="overridePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('components.branchOverride.edit.priceLabel')}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={
                        basePrice
                          ? `${t('components.branchOverride.edit.basePricePrefix')} ${basePrice}`
                          : 'Введите цену'
                      }
                      {...field}
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        field.onChange(value ? Number(value) : null)
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('components.branchOverride.edit.priceDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overrideAvailability"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      {t('components.branchOverride.edit.availabilityLabel')}
                    </FormLabel>
                    <FormDescription>
                      {t(
                        'components.branchOverride.edit.availabilityDescription'
                      )}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value ?? undefined}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                {t('components.branchOverride.edit.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t('components.branchOverride.edit.submitting')
                  : t('components.branchOverride.edit.submit')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
