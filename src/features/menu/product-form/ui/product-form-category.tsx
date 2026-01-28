'use client'

import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

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

import { useGetCategories } from '@/entities/menu/category'

export const ProductFormCategory = () => {
  const { t } = useTranslation('menu')
  const form = useFormContext()
  const { data: categories = [] } = useGetCategories()

  return (
    <FormField
      control={form.control}
      name="categoryId"
      render={({ field }) => (
        <FormItem className="md:col-span-3">
          <FormLabel>{t('products.form.category.label')}</FormLabel>
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
                  <SelectValue placeholder={t('products.form.category.placeholder')} />
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
