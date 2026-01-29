'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { z } from 'zod'

import { Button } from '@/shared/ui/base/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/base/dialog'
import {
  Form,
  FormControl,
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
import { Textarea } from '@/shared/ui/base/textarea'

import type { MockProduct, MockCategory } from '@/shared/lib/mock-menu-data'

const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' }),
  description: z
    .string()
    .min(10, { message: 'Описание должно содержать минимум 10 символов' }),
  price: z.number().min(0, { message: 'Цена не может быть отрицательной' }),
  image: z.string().url({ message: 'Введите корректный URL изображения' }),
  categoryId: z.string().min(1, { message: 'Выберите категорию' }),
})

type ProductFormValues = z.infer<typeof productSchema>

interface EditProductModalProps {
  product: MockProduct | null
  categories: MockCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (product: MockProduct) => void
}

export function EditProductModal({
  product,
  categories,
  open,
  onOpenChange,
  onSave,
}: EditProductModalProps) {
  const { t } = useTranslation('onboarding')
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      image: product?.image || '',
      categoryId: product?.categoryId || '',
    },
  })

  const imageUrl = form.watch('image')

  const onSubmit = (data: ProductFormValues) => {
    if (!product) return

    onSave({
      ...product,
      ...data,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {t('pages.menuTemplate.productDialog.edit')}
          </DialogTitle>
          <DialogDescription>
            {t('pages.menuTemplate.productDialog.editDescription')}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Left column - Image preview */}
              <div>
                <FormLabel>
                  {t('pages.menuTemplate.productDialog.image')}
                </FormLabel>
                <div className="bg-muted relative mt-2 h-48 w-full overflow-hidden rounded-lg border">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                      {t('pages.menuTemplate.productDialog.imagePreview')}
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Input
                          placeholder={t(
                            'pages.menuTemplate.productDialog.imagePlaceholder'
                          )}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right column - Basic info */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('pages.menuTemplate.productDialog.name')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t(
                            'pages.menuTemplate.productDialog.namePlaceholder'
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
                        {t('pages.menuTemplate.productDialog.price')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder={t(
                            'pages.menuTemplate.productDialog.pricePlaceholder'
                          )}
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('pages.menuTemplate.productDialog.category')}
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t(
                                'pages.menuTemplate.productDialog.categorySelect'
                              )}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.icon} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('pages.menuTemplate.productDialog.description')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'pages.menuTemplate.productDialog.descriptionPlaceholder'
                      )}
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t('pages.menuTemplate.productDialog.cancel')}
              </Button>
              <Button type="submit">
                {t('pages.menuTemplate.productDialog.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
