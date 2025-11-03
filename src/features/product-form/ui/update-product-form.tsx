'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

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

import { useGetProductById, useUpdateProduct } from '@/entities/product'

import { ProductFormAdditions } from './product-form-additions'
import { ProductFormImages } from './product-form-images'
import { ProductFormType } from './product-form-type'
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
  const { mutateAsync: updateProductMutation } = useUpdateProduct()
  const [imageFile, setImageFile] = useState<File | null>(null)
  const router = useRouter()

  const { data: product } = useGetProductById(productId)

  const defaultValues = {
    image: product?.image || '',
    name: product?.name || '',
    productTypeId: product?.productTypeId || 0,
    categoryId: product?.categoryId || 0,
    price: product?.price || 0,
    description: product?.description || '',
    isAvailable: product?.isAvailable ?? true,
    additions: [],
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
      const { requestPresignedUploadUrl, uploadToPresignedUrl, confirmUpload } =
        await import('@/entities/file')

      const presignedData = await requestPresignedUploadUrl({
        entityType: 'PRODUCT',
        entityId: productId,
        fileName: imageFile.name,
        mimeType: imageFile.type,
        fileSize: imageFile.size,
        altText: values.name,
      })

      await uploadToPresignedUrl(presignedData.data.uploadUrl, imageFile)

      const response = await confirmUpload({
        fileId: presignedData.data.fileId,
        fileKey: presignedData.data.fileKey,
      })

      imageUrl = response.variants.medium || response.variants.original || ''
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
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-3">
                <FormLabel>Название</FormLabel>
                <FormControl>
                  <Input placeholder="Введите название продукта" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductFormType />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Цена</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Введите цену"
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
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-6">
                <FormLabel>Описание</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Введите описание продукта"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ProductFormAdditions />

          <Button type="submit" className="w-full px-4 md:w-auto">
            Обновить продукт
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
