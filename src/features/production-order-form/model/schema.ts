import * as z from 'zod'

export const productionOrderFormSchema = z.object({
  warehouseId: z.number().min(1, 'Выберите склад'),
  recipeId: z.number().min(1, 'Выберите техкарту'),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  plannedDate: z.string().optional(),
  notes: z.string().optional(),
})

export type ProductionOrderFormValues = z.infer<typeof productionOrderFormSchema>

export const completeProductionSchema = z.object({
  usedIngredients: z
    .array(
      z.object({
        ingredientId: z.number(),
        usedQuantity: z.number().min(0),
      })
    )
    .optional(),
  notes: z.string().optional(),
})

export type CompleteProductionFormValues = z.infer<typeof completeProductionSchema>
