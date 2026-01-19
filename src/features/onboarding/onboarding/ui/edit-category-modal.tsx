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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import { Input } from '@/shared/ui/base/input'
import { Textarea } from '@/shared/ui/base/textarea'

import type { MockCategory } from '@/shared/lib/mock-menu-data'

const categorySchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' }),
  image: z.string().url({ message: 'Введите корректный URL изображения' }),
  icon: z.string().optional(),
  color: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface EditCategoryModalProps {
  category: MockCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (category: MockCategory) => void
}

const PRESET_ICONS = [
  '🍕',
  '🍝',
  '🥗',
  '🍲',
  '🍢',
  '🍖',
  '🍰',
  '🥤',
  '🍣',
  '🦐',
  '🍳',
  '🍔',
  '🍟',
  '☕',
  '🥬',
]
const PRESET_COLORS = [
  '#FF6B6B',
  '#FFA500',
  '#4ECB71',
  '#FF8C42',
  '#845EC2',
  '#C34A36',
  '#FF69B4',
  '#00C9FF',
  '#FF4757',
  '#3742FA',
  '#FFA502',
  '#EA2027',
  '#F79F1F',
  '#6F4E37',
  '#2ECC71',
]

export function EditCategoryModal({
  category,
  open,
  onOpenChange,
  onSave,
}: EditCategoryModalProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      image: category?.image || '',
      icon: category?.icon || '',
      color: category?.color || '#FF6B6B',
    },
  })

  const onSubmit = (data: CategoryFormValues) => {
    if (!category) return

    onSave({
      ...category,
      ...data,
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>
            Измените информацию о категории и нажмите &quot;Сохранить&quot;
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
                    <Input placeholder="Пиццы" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL изображения *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Иконка</FormLabel>
                  <div className="grid grid-cols-8 gap-2">
                    {PRESET_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`flex h-10 w-10 items-center justify-center rounded-md border-2 text-xl transition-colors ${
                          field.value === icon
                            ? 'border-primary bg-primary/10'
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => field.onChange(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <FormDescription>
                    Выберите иконку для категории
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цвет</FormLabel>
                  <div className="grid grid-cols-10 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`h-8 w-8 rounded-md border-2 transition-transform ${
                          field.value === color
                            ? 'border-primary scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => field.onChange(color)}
                        title={color}
                      />
                    ))}
                  </div>
                  <FormDescription>Выберите цвет для категории</FormDescription>
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
