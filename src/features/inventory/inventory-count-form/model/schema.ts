import * as z from 'zod'

import type { CountType } from '@/entities/inventory/inventory-count'

export const inventoryCountFormSchema = z.object({
  warehouseId: z.number({ required_error: 'Выберите склад' }),
  countType: z.string().min(1, 'Выберите тип') as z.ZodType<CountType>,
  countDate: z.string().min(1, 'Дата обязательна'),
  notes: z.string().optional(),
})

export type InventoryCountFormValues = z.infer<typeof inventoryCountFormSchema>

export const countTypeOptions = [
  { value: 'full', label: 'Полная инвентаризация' },
  { value: 'cycle', label: 'Циклическая проверка' },
  { value: 'spot', label: 'Выборочная проверка' },
]
