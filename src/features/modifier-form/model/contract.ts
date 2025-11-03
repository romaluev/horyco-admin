/**
 * Modifier Form Validation Schemas
 * Zod validation for modifier forms
 */

import { z } from 'zod'

export const modifierGroupFormSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Название должно содержать минимум 2 символа' })
      .max(100, { message: 'Название не должно превышать 100 символов' }),
    productId: z.number({ required_error: 'Выберите продукт' }),
    minSelection: z
      .number()
      .min(0, { message: 'Минимум должен быть >= 0' })
      .default(0),
    maxSelection: z
      .number()
      .min(1, { message: 'Максимум должен быть >= 1' })
      .default(1),
    isRequired: z.boolean().default(false),
    sortOrder: z.number().min(0).optional(),
  })
  .refine((data) => data.minSelection <= data.maxSelection, {
    message: 'Минимум не может быть больше максимума',
    path: ['minSelection'],
  })

export const modifierFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' })
    .max(100, { message: 'Название не должно превышать 100 символов' }),
  description: z
    .string()
    .max(500, { message: 'Описание не должно превышать 500 символов' })
    .optional(),
  price: z
    .number({ required_error: 'Укажите цену' })
    .min(0, { message: 'Цена должна быть >= 0' }),
  modifierGroupId: z.number({ required_error: 'Выберите группу' }),
  sortOrder: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
})

export type ModifierGroupFormValues = z.infer<typeof modifierGroupFormSchema>
export type ModifierFormValues = z.infer<typeof modifierFormSchema>
