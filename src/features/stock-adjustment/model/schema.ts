import * as z from 'zod'

export const stockAdjustmentSchema = z.object({
  inventoryItemId: z.number().min(1, 'Выберите товар'),
  quantity: z.number().refine((val) => val !== 0, 'Количество не может быть 0'),
  reason: z.string().min(1, 'Укажите причину'),
})

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>
