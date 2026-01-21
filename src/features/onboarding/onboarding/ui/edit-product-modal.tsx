'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
          <DialogTitle>Редактировать продукт</DialogTitle>
          <DialogDescription>
            Измените информацию о продукте и нажмите &quot;Сохранить&quot;
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Left column - Image preview */}
              <div>
                <FormLabel>Изображение</FormLabel>
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
                      Предпросмотр изображения
                    </div>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Input placeholder="URL изображения" {...field} />
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
                      <FormLabel>Название *</FormLabel>
                      <FormControl>
                        <Input placeholder="Пицца Маргарита" {...field} />
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
                      <FormLabel>Цена (сум) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="89000"
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
                      <FormLabel>Категория *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
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
                  <FormLabel>Описание *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Описание продукта..."
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
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
