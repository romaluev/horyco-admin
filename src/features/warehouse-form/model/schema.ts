import * as z from 'zod'

export const warehouseFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export type WarehouseFormValues = z.infer<typeof warehouseFormSchema>
