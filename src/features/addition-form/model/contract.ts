/**
 * Addition Form Contract
 * Zod validation schemas for addition forms
 */

import { z } from 'zod'

/**
 * Schema for creating/updating an addition group
 */
export const additionSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  description: z.string().optional(),
  productId: z.number().positive('Продукт обязателен'),
  isRequired: z.boolean().default(false),
  isMultiple: z.boolean().default(false),
  isCountable: z.boolean().default(false),
  minSelection: z.number().min(0).default(0),
  maxSelection: z.number().min(1).default(1),
  sortOrder: z.number().min(0).default(0),
  isActive: z.boolean().default(true),
})

export type AdditionFormValues = z.infer<typeof additionSchema>

/**
 * Schema for creating/updating an addition item
 */
export const additionItemSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  price: z.number().min(0, 'Цена должна быть положительной'),
  additionId: z.number().positive('ID дополнения обязателен'),
  sortOrder: z.number().min(0).default(0),
})

export type AdditionItemFormValues = z.infer<typeof additionItemSchema>
