import * as z from 'zod'

import { WriteoffReason } from '@/shared/types/inventory'

export const writeoffItemSchema = z.object({
  inventoryItemId: z.number().min(1, 'Выберите товар'),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unitCost: z.number().min(0).optional(),
})

export const writeoffFormSchema = z.object({
  warehouseId: z.number().min(1, 'Выберите склад'),
  reason: z.nativeEnum(WriteoffReason, {
    errorMap: () => ({ message: 'Выберите причину' }),
  }),
  notes: z.string().optional(),
  items: z.array(writeoffItemSchema).min(1, 'Добавьте хотя бы один товар'),
})

export type WriteoffFormValues = z.infer<typeof writeoffFormSchema>

export const rejectWriteoffSchema = z.object({
  reason: z.string().min(1, 'Укажите причину отклонения'),
})

export type RejectWriteoffFormValues = z.infer<typeof rejectWriteoffSchema>
