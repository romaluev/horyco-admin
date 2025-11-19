/**
 * Edit Category Dialog Component
 * Modal for editing existing categories
 */

'use client'

import { useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil } from 'lucide-react'
import { useForm } from 'react-hook-form'

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Switch } from '@/shared/ui/base/switch'
import { Textarea } from '@/shared/ui/base/textarea'
import { ImageUpload } from '@/shared/ui/image-upload'

import { type ICategory, useUpdateCategory } from '@/entities/category'

import { CategoryParentSelector } from './category-parent-selector'
import { categoryFormSchema, type CategoryFormValues } from '../model/contract'

interface EditCategoryDialogProps {
  category: ICategory
}

export const EditCategoryDialog = ({ category }: EditCategoryDialogProps) => {
  const [open, setOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { mutate: updateCategory, isPending } = useUpdateCategory()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      description: category.description || '',
      parentId: category.parentId,
      image: category.image || '',
      isActive: category.isActive,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: category.name,
        description: category.description || '',
        parentId: category.parentId,
        image: category.image || '',
        isActive: category.isActive,
      })
      setImageFile(null)
    }
  }, [open, category, form])

  const onSubmit = async (data: CategoryFormValues): Promise<void> => {
    try {
      let imageUrl = data.image

      if (imageFile) {
        const { uploadFile } = await import('@/shared/lib/file-upload')
        const { FILE_FOLDERS } = await import('@/entities/file/model/constants')

        const response = await uploadFile({
          file: imageFile,
          folder: FILE_FOLDERS.CATEGORIES,
          altText: data.name,
        })

        imageUrl = response.variants.medium || response.variants.original || ''
      }

      // Update category with image URL
      updateCategory(
        { id: category.id, data: { ...data, image: imageUrl } },
        {
          onSuccess: () => {
            setOpen(false)
            setImageFile(null)
          },
        }
      )
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>
            Внесите изменения в категорию {category.name}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input placeholder="Напитки" {...field} />
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
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Горячие и холодные напитки"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Родительская категория</FormLabel>
                  <FormControl>
                    <CategoryParentSelector
                      value={field.value ?? undefined}
                      onChange={field.onChange}
                      excludeId={category.id}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="pb-2">Изображение</FormLabel>
              <ImageUpload
                value={imageFile}
                onChange={setImageFile}
                currentImageUrl={category.image || ''}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Активна</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Категория будет доступна в меню
                    </p>
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
                Отмена
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
