import * as z from 'zod'

import { CountType } from '@/shared/types/inventory'

export const countFormSchema = z.object({
  warehouseId: z.number().min(1, 'Выберите склад'),
  type: z.nativeEnum(CountType, {
    errorMap: () => ({ message: 'Выберите тип' }),
  }),
  name: z.string().min(1, 'Название обязательно'),
  notes: z.string().optional(),
  itemIds: z.array(z.number()).optional(),
  categoryFilter: z.string().optional(),
})

export type CountFormValues = z.infer<typeof countFormSchema>

export const countItemSchema = z.object({
  countedQuantity: z.number().min(0, 'Количество не может быть отрицательным'),
  notes: z.string().optional(),
})

export type CountItemFormValues = z.infer<typeof countItemSchema>

export const rejectCountSchema = z.object({
  reason: z.string().min(1, 'Укажите причину отклонения'),
})

export type RejectCountFormValues = z.infer<typeof rejectCountSchema>
