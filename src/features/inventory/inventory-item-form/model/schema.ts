import * as z from 'zod'

export const inventoryItemFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().min(1, 'Единица измерения обязательна'),
  minStockLevel: z
    .number()
    .min(0, 'Минимальный остаток не может быть отрицательным')
    .default(0),
  maxStockLevel: z.number().min(0).optional(),
  reorderPoint: z.number().min(0).optional(),
  reorderQuantity: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  isSemiFinished: z.boolean().default(false),
  isTrackable: z.boolean().default(true),
  shelfLifeDays: z
    .number()
    .min(0, 'Срок годности не может быть отрицательным')
    .optional(),
  defaultSupplierId: z.number().optional(),
  taxRate: z.number().min(0).max(100).default(0),
  notes: z.string().optional(),
})

export type InventoryItemFormValues = z.infer<typeof inventoryItemFormSchema>

export const unitOptions = [
  { value: 'шт', label: 'Штуки (шт)' },
  { value: 'кг', label: 'Килограммы (кг)' },
  { value: 'г', label: 'Граммы (г)' },
  { value: 'л', label: 'Литры (л)' },
  { value: 'мл', label: 'Миллилитры (мл)' },
  { value: 'уп', label: 'Упаковка (уп)' },
  { value: 'бут', label: 'Бутылка (бут)' },
  { value: 'бан', label: 'Банка (бан)' },
]

export const categoryOptions = [
  { value: 'Мясо', label: 'Мясо' },
  { value: 'Рыба', label: 'Рыба' },
  { value: 'Овощи', label: 'Овощи' },
  { value: 'Фрукты', label: 'Фрукты' },
  { value: 'Молочные продукты', label: 'Молочные продукты' },
  { value: 'Напитки', label: 'Напитки' },
  { value: 'Специи', label: 'Специи' },
  { value: 'Крупы', label: 'Крупы' },
  { value: 'Хозтовары', label: 'Хозтовары' },
  { value: 'Другое', label: 'Другое' },
]
