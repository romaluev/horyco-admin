import * as z from 'zod'

export const inventoryItemFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  sku: z.string().optional(),
  category: z.string().min(1, 'Категория обязательна'),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  minStock: z.number().min(0, 'Минимальный остаток не может быть отрицательным').optional(),
  maxStock: z.number().min(0, 'Максимальный остаток не может быть отрицательным').optional(),
  notes: z.string().optional(),
})

export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>

export const unitConversionSchema = z.object({
  fromUnit: z.string().min(1, 'Единица обязательна'),
  toUnit: z.string().min(1, 'Целевая единица обязательна'),
  factor: z.number().min(0.001, 'Коэффициент должен быть больше 0'),
})

export type UnitConversionFormValues = z.infer<typeof unitConversionSchema>
