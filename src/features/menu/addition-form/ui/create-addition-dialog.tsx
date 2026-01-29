/**
 * Create Addition Dialog
 * Dialog for creating a new addition group
 */

'use client'

import * as React from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'
import { Switch } from '@/shared/ui/base/switch'
import { Textarea } from '@/shared/ui/base/textarea'
import { ImageUpload } from '@/shared/ui/image-upload'

import { additionApi, useCreateAddition } from '@/entities/menu/addition'
import { useGetProducts } from '@/entities/menu/product'

import { type AdditionFormValues, additionSchema } from '../model/contract'

interface CreateAdditionDialogProps {
  productId?: number
  trigger?: React.ReactNode
}

export const CreateAdditionDialog = ({
  productId,
  trigger,
}: CreateAdditionDialogProps) => {
  const { t } = useTranslation('menu')
  const [isOpen, setIsOpen] = useState(false)
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const { mutate: createAddition, isPending } = useCreateAddition()
  const { data: productsData } = useGetProducts({ limit: 100 })

  const products = productsData?.data || []

  const form = useForm<AdditionFormValues>({
    resolver: zodResolver(additionSchema),
    defaultValues: {
      name: '',
      description: '',
      productId: productId || 0,
      isRequired: false,
      isMultiple: false,
      isCountable: false,
      minSelection: 0,
      maxSelection: 1,
      sortOrder: 0,
      isActive: true,
    },
  })

  const handleSubmit = async (values: AdditionFormValues): Promise<void> => {
    try {
      // First create the addition
      const createdAddition = await new Promise<{ id: number }>(
        (resolve, reject) => {
          createAddition(values, {
            onSuccess: (addition) => resolve(addition),
            onError: (error) => reject(error),
          })
        }
      )

      // Upload image if provided
      if (imageFile && createdAddition?.id) {
        const { uploadFile } = await import('@/shared/lib/file-upload')

        const response = await uploadFile({
          file: imageFile,
          entityType: 'ADDITION',
          entityId: createdAddition.id,
          altText: values.name,
        })

        // Update addition with image ID
        const imageId = String(response.id)
        await additionApi.updateAddition(createdAddition.id, {
          image: imageId,
        })
      }

      setIsOpen(false)
      form.reset()
      setImageFile(null)
    } catch (error) {
      console.error('Error creating addition:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{t('additions.form.title.create')}</Button>}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('additions.form.title.create')}</DialogTitle>
          <DialogDescription>
            {t('additions.form.title.createDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {!productId && (
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('additions.form.product.label')}</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value ? field.value.toString() : ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t(
                              'additions.form.product.placeholder'
                            )}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem
                            key={product.id}
                            value={product.id.toString()}
                          >
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('additions.form.name.label')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('additions.form.name.placeholder')}
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
                  <FormLabel>{t('additions.form.description.label')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('additions.form.description.placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="pb-2">
                {t('additions.form.image.label')}
              </FormLabel>
              <ImageUpload value={imageFile} onChange={setImageFile} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="minSelection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('additions.form.minSelection.label')}
                    </FormLabel>
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
                    <FormLabel>
                      {t('additions.form.maxSelection.label')}
                    </FormLabel>
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
                    <FormLabel>
                      {t('additions.form.isRequired.label')}
                    </FormLabel>
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
                    <FormLabel>
                      {t('additions.form.isMultiple.label')}
                    </FormLabel>
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
                    <FormLabel>
                      {t('additions.form.isCountable.label')}
                    </FormLabel>
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
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
              >
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? t('common.loading')
                  : t('additions.form.title.create')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
