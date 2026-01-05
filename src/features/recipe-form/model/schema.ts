import * as z from 'zod'

import { RecipeLinkType } from '@/shared/types/inventory'

export const recipeIngredientSchema = z.object({
  inventoryItemId: z.number().optional(),
  recipeId: z.number().optional(),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unit: z.string().min(1, 'Единица обязательна'),
  wastagePercent: z.number().min(0).max(100).optional(),
})

export const recipeFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  outputQuantity: z.number().min(0.001, 'Выход должен быть больше 0'),
  outputUnit: z.string().min(1, 'Единица выхода обязательна'),
  linkedType: z.nativeEnum(RecipeLinkType).optional(),
  linkedId: z.number().optional(),
  notes: z.string().optional(),
  ingredients: z.array(recipeIngredientSchema).min(1, 'Добавьте хотя бы один ингредиент'),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>

export const recipeIngredientFormSchema = z.object({
  type: z.enum(['item', 'recipe']),
  inventoryItemId: z.number().optional(),
  recipeId: z.number().optional(),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unit: z.string().min(1, 'Единица обязательна'),
  wastagePercent: z.number().min(0).max(100).optional(),
}).refine(
  (data) => {
    if (data.type === 'item') return !!data.inventoryItemId
    if (data.type === 'recipe') return !!data.recipeId
    return false
  },
  { message: 'Выберите товар или полуфабрикат' }
)

export type RecipeIngredientFormValues = z.infer<typeof recipeIngredientFormSchema>
