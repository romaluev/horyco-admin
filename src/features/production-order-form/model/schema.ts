import * as z from 'zod'

export const productionOrderFormSchema = z.object({
  warehouseId: z.number({ required_error: 'Выберите склад' }),
  recipeId: z.number({ required_error: 'Выберите техкарту' }),
  quantityPlanned: z.number().min(0.01, 'Количество должно быть больше 0'),
  plannedDate: z.string().optional(),
  unit: z.string().optional(),
  notes: z.string().optional(),
})

export type ProductionOrderFormValues = z.infer<typeof productionOrderFormSchema>
