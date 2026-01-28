import * as z from 'zod'

export const warehouseFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно').max(100, 'Максимум 100 символов'),
  code: z.string().max(50, 'Максимум 50 символов').optional(),
  branchId: z.number({ required_error: 'Выберите филиал' }),
  isActive: z.boolean().default(true),
})

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>
