/**
 * Update Addition Dialog
 * Dialog for updating an existing addition group
 */

'use client'

import * as React from 'react'
import { useEffect } from 'react'

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
import { ImageUpload } from '@/shared/ui/image-upload'

import { additionApi, useUpdateAddition } from '@/entities/menu/addition'

import { additionSchema, type AdditionFormValues } from '../model/contract'

import type { IAddition } from '@/entities/menu/addition'

interface UpdateAdditionDialogProps {
  addition: IAddition
  isOpen: boolean
  onClose: () => void
}

export const UpdateAdditionDialog = ({
  addition,
  isOpen,
  onClose,
}: UpdateAdditionDialogProps) => {
  const { t } = useTranslation('menu')
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const { mutate: updateAddition, isPending } = useUpdateAddition()

  const form = useForm<AdditionFormValues>({
    resolver: zodResolver(additionSchema),
    defaultValues: {
      name: addition.name,
      description: addition.description || '',
      productId: addition.productId,
      isRequired: addition.isRequired,
      isMultiple: addition.isMultiple,
      isCountable: addition.isCountable,
      minSelection: addition.minSelection,
      maxSelection: addition.maxSelection,
      sortOrder: addition.sortOrder || 0,
      isActive: addition.isActive ?? true,
    },
  })

  // Reset form when addition changes
  useEffect(() => {
    if (addition) {
      form.reset({
        name: addition.name,
        description: addition.description || '',
        productId: addition.productId,
        isRequired: addition.isRequired,
        isMultiple: addition.isMultiple,
        isCountable: addition.isCountable,
        minSelection: addition.minSelection,
        maxSelection: addition.maxSelection,
        sortOrder: addition.sortOrder || 0,
        isActive: addition.isActive ?? true,
      })
      setImageFile(null)
    }
  }, [addition, form])

  const handleSubmit = async (values: AdditionFormValues): Promise<void> => {
    try {
      // Upload image if provided
      if (imageFile) {
        const { uploadFile } = await import('@/shared/lib/file-upload')

        const response = await uploadFile({
          file: imageFile,
          entityType: 'ADDITION',
          entityId: addition.id,
          altText: values.name,
        })

        // Update addition with image ID
        const imageId = String(response.id)
        await additionApi.updateAddition(addition.id, {
          ...values,
          image: imageId,
        })
        onClose()
        return
      }

      // Update without image change
      updateAddition(
        { id: addition.id, data: values },
        {
          onSuccess: () => {
            onClose()
          },
        }
      )
    } catch (error) {
      console.error('Error updating addition:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('additions.form.title.edit')}</DialogTitle>
          <DialogDescription>
            {t('additions.form.title.editDescription')}
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
                  <FormLabel>{t('additions.form.name.label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('additions.form.name.placeholder')} {...field} />
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
                  <FormLabel>{t('additions.form.description.label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('additions.form.description.placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="pb-2">{t('additions.form.image.label')}</FormLabel>
              <ImageUpload
                value={imageFile}
                onChange={setImageFile}
                currentImageUrl={addition.image}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('additions.form.minSelection.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
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
                name="maxSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('additions.form.maxSelection.label')}</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
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
                  <FormLabel>{t('additions.form.sortOrder.label')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    {t('additions.form.sortOrder.description')}
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
                    <FormLabel>{t('additions.form.isRequired.label')}</FormLabel>
                    <FormDescription>
                      {t('additions.form.isRequired.description')}
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

            <FormField
              control={form.control}
              name="isMultiple"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{t('additions.form.isMultiple.label')}</FormLabel>
                    <FormDescription>
                      {t('additions.form.isMultiple.description')}
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

            <FormField
              control={form.control}
              name="isCountable"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{t('additions.form.isCountable.label')}</FormLabel>
                    <FormDescription>
                      {t('additions.form.isCountable.description')}
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>{t('additions.form.isActive.label')}</FormLabel>
                    <FormDescription>
                      {t('additions.form.isActive.description')}
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
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('common.loading') : t('additions.actions.update')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
