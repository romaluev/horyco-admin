'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { useRouter } from '@/shared/lib/navigation'
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@/shared/ui'
import { Switch } from '@/shared/ui/base/switch'

import { useGetProductById, useUpdateProduct } from '@/entities/menu/product'

import { ProductFormCategory } from './product-form-category'
import { ProductFormImages } from './product-form-images'
import { productSchema } from '../model/contract'

import type * as z from 'zod'

interface UpdateProductFormProps {
  productId: number
  onSuccess?: () => void
}

export const UpdateProductForm = ({
  productId,
  onSuccess,
}: UpdateProductFormProps) => {
  const { t } = useTranslation('menu')
  const { mutateAsync: updateProductMutation } = useUpdateProduct()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  const { data: product } = useGetProductById(productId)

  const defaultValues = {
    image: product?.image || '',
    name: product?.name || '',
    categoryId: product?.categoryId || 0,
    productTypeId: product?.productTypeId || 1,
    price: product?.price || 0,
    preparationTime: product?.preparationTime || undefined,
    calories: product?.calories || undefined,
    description: product?.description || '',
    allergens: product?.allergens || [],
    isAvailable: product?.isAvailable ?? true,
  }

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const onSubmit = async () => {
    const values = form.getValues()
    const productData = values

    let imageUrl = productData.image

    // If there's a new file, upload it
    if (imageFile) {
      const { uploadFile } = await import('@/shared/lib/file-upload')

      const response = await uploadFile({
        file: imageFile,
        entityType: 'PRODUCT',
        entityId: product?.id || 0,
        altText: values.name,
      })

      // Save file ID only (backend will generate presigned URLs in imageUrls field)
      imageUrl = String(response.id)
    }

    await updateProductMutation({
      id: productId,
      data: { ...productData, image: imageUrl },
    })

    if (onSuccess) {
      onSuccess()
    } else {
      router.push('/dashboard/menu/products')
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-6">
          <ProductFormImages
            imageFile={imageFile}
            setImageFile={setImageFile}
            currentImageUrl={product?.image}
            currentImageUrls={product?.imageUrls}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>{t('products.form.name.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('products.form.name.placeholder')}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductFormCategory />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('products.form.price.label')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('products.form.price.placeholder')}
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
            name="preparationTime"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>
                  {t('products.form.preparationTime.label')}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('products.form.preparationTime.placeholder')}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="calories"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>{t('products.form.calories.label')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('products.form.calories.placeholder')}
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
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
              <FormItem className="md:col-span-6">
                <FormLabel>{t('products.form.description.label')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('products.form.description.placeholder')}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allergens"
            render={({ field }) => (
              <FormItem className="md:col-span-6">
                <FormLabel>{t('products.form.allergens.label')}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={t('products.form.allergens.placeholder')}
                    {...field}
                    value={field.value?.join(', ') || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      const allergens = value
                        ? value
                            .split(',')
                            .map((a) => a.trim())
                            .filter(Boolean)
                        : []
                      field.onChange(allergens)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isAvailable"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2 space-y-0 md:col-span-6">
                <FormControl>
                  <Switch checked={field.value} onChange={field.onChange} />
                </FormControl>
                <FormLabel className="!mt-0">
                  {t('products.form.available.label')}
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full px-4 md:w-auto">
            {t('products.actions.update')}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
