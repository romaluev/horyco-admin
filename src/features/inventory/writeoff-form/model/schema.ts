import * as z from 'zod'

import type { WriteoffReason } from '@/entities/inventory/writeoff'

export const writeoffFormSchema = z.object({
  warehouseId: z.number({ required_error: 'Выберите склад' }),
  reason: z.string().min(1, 'Выберите причину') as z.ZodType<WriteoffReason>,
  notes: z.string().optional(),
})

export type WriteoffFormValues = z.infer<typeof writeoffFormSchema>

export const writeoffReasonOptions = [
  { value: 'spoilage', label: 'Порча' },
  { value: 'theft', label: 'Кража' },
  { value: 'damage', label: 'Повреждение' },
  { value: 'staff_meal', label: 'Питание персонала' },
  { value: 'sample', label: 'Дегустация' },
  { value: 'expired', label: 'Истёк срок' },
  { value: 'production', label: 'Производство' },
  { value: 'other', label: 'Другое' },
]
