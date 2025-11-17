import * as z from 'zod'

import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/shared/config/data'

export interface ProductFormValues {
  name: string
  categoryId: number
  productTypeId?: number
  price: number
  description: string
  preparationTime?: number
  calories?: number
  allergens?: string[]
  isAvailable?: boolean
  additions: z.infer<typeof additionSchema>[]
  image?: string
}

const additionProductSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: 'Название элемента обязательно' }),
  price: z
    .number()
    .min(0, { message: 'Цена должна быть положительным числом' }),
  additionId: z.number().optional(),
  isDeleted: z.boolean().optional(),
})

const additionSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, {
    message: 'Название дополнения должно содержать минимум 2 символа',
  }),
  isRequired: z.boolean(),
  isMultiple: z.boolean(),
  limit: z.number().min(1, { message: 'Лимит должен быть не менее 1' }),
  additionProducts: z.array(additionProductSchema).min(1),
  productId: z.number().optional(),
  isDeleted: z.boolean().optional(),
})

export const productSchema = z.object({
  image: z.string().optional(),
  name: z.string().min(2, {
    message: 'Название должно содержать минимум 2 символа',
  }),
  categoryId: z.number().min(1, { message: 'Укажите категорию' }),
  productTypeId: z.number().optional().default(1),
  price: z
    .number()
    .min(0, { message: 'Цена должна быть положительным числом' }),
  description: z.string(),
  preparationTime: z.number().min(0).optional(),
  calories: z.number().min(0).optional(),
  allergens: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional().default(true),
  additions: z.array(additionSchema).optional().default([]),
})
