import * as z from 'zod'

import { MOVEMENT_TYPES, type MovementType } from '@/shared/types/inventory'

export const stockAdjustmentSchema = z.object({
  warehouseId: z.number().min(1, 'Выберите склад'),
  itemId: z.number().min(1, 'Выберите товар'),
  quantityChange: z.number().refine((val) => val !== 0, 'Количество не может быть 0'),
  reason: z.string().min(1, 'Выберите причину') as z.ZodType<MovementType>,
  notes: z.string().optional(),
  referenceNumber: z.string().optional(),
})

export type StockAdjustmentFormValues = z.infer<typeof stockAdjustmentSchema>

export const adjustmentReasons: { value: MovementType; label: string }[] = [
  { value: MOVEMENT_TYPES.MANUAL_ADJUSTMENT, label: 'Ручная корректировка' },
  { value: MOVEMENT_TYPES.COUNT_ADJUSTMENT, label: 'Инвентаризация' },
  { value: MOVEMENT_TYPES.WRITEOFF, label: 'Списание' },
  { value: MOVEMENT_TYPES.SALE_REVERSAL, label: 'Возврат по отмене' },
  { value: MOVEMENT_TYPES.OPENING_BALANCE, label: 'Начальный остаток' },
]
