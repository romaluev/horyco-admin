/**
 * Category Form Validation Schemas
 * Zod validation for category forms
 */

import { z } from 'zod'

export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Название должно содержать минимум 2 символа' })
    .max(100, { message: 'Название не должно превышать 100 символов' }),
  description: z
    .string()
    .max(500, { message: 'Описание не должно превышать 500 символов' })
    .optional(),
  parentId: z.number().nullable().optional(),
  image: z
    .string()
    .url({ message: 'Некорректный URL изображения' })
    .optional()
    .or(z.literal('')),
  sortOrder: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
