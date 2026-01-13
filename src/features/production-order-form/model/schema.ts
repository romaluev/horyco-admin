import * as z from 'zod'

export const productionOrderFormSchema = z.object({
  warehouseId: z.number({ required_error: 'Выберите склад' }),
  recipeId: z.number({ required_error: 'Выберите техкарту' }),
  plannedQuantity: z.number().min(0.01, 'Количество должно быть больше 0'),
  plannedDate: z.string().min(1, 'Дата обязательна'),
  notes: z.string().optional(),
})

export type ProductionOrderFormValues = z.infer<typeof productionOrderFormSchema>
