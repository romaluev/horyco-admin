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

import { useGetProductTypes } from '@/entities/product'

export const ProductFormType = () => {
  const form = useFormContext()
  const { data: productTypes } = useGetProductTypes()
  return (
    <FormField
      control={form.control}
      name="productTypeId"
      render={({ field }) => (
        <FormItem className="md:col-span-3">
          <FormLabel>Тип продукта</FormLabel>
          <div className="w-full">
            <Select
              onValueChange={(value) => {
                form.setValue('productTypeId', Number(value))
                form.trigger('productTypeId')
              }}
              defaultValue={field.value ? `${field.value}` : undefined}
              value={field.value ? `${field.value}` : undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите тип продукта" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {productTypes?.data?.map((type) => (
                  <SelectItem key={type.id} value={`${type.id}`}>
                    {type.name}
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
