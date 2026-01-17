import * as z from 'zod'

export const purchaseOrderFormSchema = z.object({
  warehouseId: z.number({ required_error: 'Выберите склад' }),
  supplierId: z.number({ required_error: 'Выберите поставщика' }),
  orderDate: z.string().min(1, 'Дата заказа обязательна'),
  expectedDate: z.string().optional(),
  discountAmount: z.number().min(0).optional(),
  currency: z.string().default('UZS'),
  notes: z.string().optional(),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>
