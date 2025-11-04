'use client'

import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/base/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/base/select'

import { useGetCategories } from '@/entities/category'

export const ProductFormCategory = () => {
  const form = useFormContext()
  const { data: categories = [] } = useGetCategories()

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem className="md:col-span-3">
          <FormLabel>Категория</FormLabel>
          <div className="w-full">
            <Select
              onValueChange={(value) => {
                form.setValue('categoryId', Number(value))
                form.trigger('categoryId')
              }}
              defaultValue={field.value ? `${field.value}` : undefined}
              value={field.value ? `${field.value}` : undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={`${category.id}`}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}
