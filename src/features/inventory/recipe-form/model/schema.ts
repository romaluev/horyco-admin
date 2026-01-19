import * as z from 'zod'

export const recipeFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  outputQuantity: z.number().min(0.01, 'Количество должно быть больше 0').default(1),
  outputUnit: z.string().optional(),
  prepTimeMinutes: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>

export const outputUnitOptions = [
  { value: 'шт', label: 'Штуки' },
  { value: 'порция', label: 'Порция' },
  { value: 'кг', label: 'Килограмм' },
  { value: 'г', label: 'Грамм' },
  { value: 'л', label: 'Литр' },
  { value: 'мл', label: 'Миллилитр' },
]
