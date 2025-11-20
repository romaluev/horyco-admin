/**
 * Create Modifier Dialog Component
 * Modal for creating new modifiers within a group
 */

'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
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

import { modifierApi, useCreateModifier } from '@/entities/modifier'

import { modifierFormSchema, type ModifierFormValues } from '../model/contract'

interface CreateModifierDialogProps {
  modifierGroupId: number
  onSuccess?: () => void
}

export const CreateModifierDialog = ({
  modifierGroupId,
  onSuccess,
}: CreateModifierDialogProps) => {
  const [open, setOpen] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { mutate: createModifier, isPending } = useCreateModifier()

  const form = useForm<ModifierFormValues>({
    resolver: zodResolver(modifierFormSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      price: 0,
      modifierGroupId,
      isActive: true,
    },
  })

  const onSubmit = async (data: ModifierFormValues): Promise<void> => {
    try {
      // Create modifier first
      const createdModifier = await new Promise<{ id: number }>((resolve, reject) => {
        createModifier(data, {
          onSuccess: (modifier) => resolve(modifier),
          onError: (error) => reject(error),
        })
      })

      // Upload image if provided
      if (imageFile && createdModifier?.id) {
        const { uploadFile } = await import('@/shared/lib/file-upload')
        const { FILE_FOLDERS } = await import('@/entities/file/model/constants')

        const response = await uploadFile({
          file: imageFile,
          folder: FILE_FOLDERS.MODIFIERS,
          altText: data.name,
        })

        // Save file ID only (backend will generate presigned URLs in imageUrls field)
        const imageId = String(response.id)
        await modifierApi.updateModifier(createdModifier.id, { image: imageId })
      }

      setOpen(false)
      form.reset()
      setImageFile(null)
      onSuccess?.()
    } catch (error) {
      console.error('Failed to create modifier:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Добавить опцию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить модификатор</DialogTitle>
          <DialogDescription>
            Создайте новую опцию для группы модификаторов
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
                    <Input placeholder="Extra Cheese" {...field} />
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
                      placeholder="Дополнительная порция сыра"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormControl>
                <ImageUpload
                  value={imageFile}
                  onChange={(file) => {
                    setImageFile(file)
                  }}
                  currentImageUrl={form.getValues('image')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дополнительная цена *</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                      <span>₽</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <FormLabel>Активен</FormLabel>
                    <p className="text-muted-foreground text-sm">
                      Опция будет доступна для выбора
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
                {isPending ? 'Создание...' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
