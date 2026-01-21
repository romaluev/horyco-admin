'use client'

import { useEffect, useState } from 'react'

import { useRouter } from '@/shared/lib/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { StarsIcon } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

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

import { useCreateProduct } from '@/entities/menu/product'

import { ProductFormCategory } from './product-form-category'
import { ProductFormImages } from './product-form-images'
import { productSchema } from '../model/contract'

import type { ProductFormValues } from '../model/contract'

const EXPAND_USAGE_KEY = 'expand_usage'

export const CreateProductForm = () => {
  const { mutateAsync: createProductMutation } = useCreateProduct()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [expandLoading, setExpandLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [expandUsageCount, setExpandUsageCount] = useState(0)

  useEffect(() => {
    setExpandUsageCount(parseInt(localStorage.getItem(EXPAND_USAGE_KEY) || '0'))
  }, [])

  const defaultValues: Partial<ProductFormValues> = {
    name: '',
    categoryId: 0,
    productTypeId: 1,
    price: 0,
    description: '',
    isAvailable: true,
    image: '',
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  })

  const handleExpandDescription = async (): Promise<void> => {
    const usageCount = parseInt(localStorage.getItem(EXPAND_USAGE_KEY) || '0')
    if (usageCount <= 5 || expandLoading || expanded) return

    const description = form.getValues('description')

    if (description.length < 10) {
      toast.error('Слишком короткое описание')
      return
    }

    setExpandLoading(true)
    try {
      localStorage.setItem(EXPAND_USAGE_KEY, (usageCount + 1).toString())
      const res = await fetch('/api/expand-description', {
        method: 'POST',
        body: JSON.stringify({ description }),
      })

      const body = await res.json()

      form.setValue('description', body.description)
      toast.success('Описание успешно расширено!')
      setExpanded(true)
    } catch (e) {
      toast.error('Что-то пошло не так')
    }
    setExpandLoading(false)
  }

  const onSubmit = async (values: ProductFormValues): Promise<void> => {
    const productData = {
      ...values,
      productTypeId: values.productTypeId || 1,
    }
    setSending(true)

    try {
      // Create product first
      const createdProduct = await createProductMutation(productData)

      // If there's a file, upload it and update the product
      if (imageFile && createdProduct?.id) {
        const { uploadFile } = await import('@/shared/lib/file-upload')
        const { productApi } = await import('@/entities/menu/product')

        const response = await uploadFile({
          file: imageFile,
          entityType: 'PRODUCT',
          entityId: createdProduct.id,
          altText: values.name,
        })

        // Save file ID only (backend will generate presigned URLs in imageUrls field)
        const imageId = String(response.id)
        await productApi.updateProduct(createdProduct.id, { image: imageId })
      }

      setSending(false)
      router.push('/dashboard/menu/products')
    } catch (e) {
      setSending(false)
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 items-start gap-x-2 gap-y-4 md:grid-cols-6">
          <ProductFormImages
            imageFile={imageFile}
            setImageFile={setImageFile}
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

          <ProductFormCategory />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Цена (обязательно)</FormLabel>
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
            name="preparationTime"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Время приготовления (мин)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Например: 15"
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
                <FormLabel>Калории</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Например: 350"
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
          {!expanded && expandUsageCount < 5 && (
            <Button
              onClick={handleExpandDescription}
              type="button"
              disabled={expandLoading}
              className="relative inline-flex h-9 w-60 overflow-hidden rounded-lg p-[2px] focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 focus:outline-none"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#023055_0%,#fe4a49_50%,#023055_100%)]" />
              <span className="bg-background inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-1 text-sm font-medium text-[#023055] backdrop-blur-3xl transition hover:text-[#fe4a49]">
                <StarsIcon size={16} />
                {expandLoading ? 'Обрабатывается...' : 'Расширить с AI'}
              </span>
            </Button>
          )}

          <FormField
            control={form.control}
            name="allergens"
            render={({ field }) => (
              <FormItem className="md:col-span-6">
                <FormLabel>Аллергены (через запятую)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Например: молоко, яйца, орехи"
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
                  Продукт доступен для заказа
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-40 max-w-40" disabled={sending}>
            Создать продукт
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
