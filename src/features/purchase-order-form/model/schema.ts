import * as z from 'zod'

export const poItemSchema = z.object({
  inventoryItemId: z.number().min(1, 'Выберите товар'),
  quantity: z.number().min(0.001, 'Количество должно быть больше 0'),
  unitPrice: z.number().min(0, 'Цена не может быть отрицательной'),
})

export const purchaseOrderFormSchema = z.object({
  warehouseId: z.number().min(1, 'Выберите склад'),
  supplierId: z.number().min(1, 'Выберите поставщика'),
  expectedDate: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(poItemSchema).min(1, 'Добавьте хотя бы один товар'),
})

export type PurchaseOrderFormValues = z.infer<typeof purchaseOrderFormSchema>

export const receiveItemSchema = z.object({
  itemId: z.number(),
  receivedQuantity: z.number().min(0),
})

export const receivePOFormSchema = z.object({
  receiveDate: z.string().min(1, 'Укажите дату приёмки'),
  items: z.array(receiveItemSchema),
  notes: z.string().optional(),
})

export type ReceivePOFormValues = z.infer<typeof receivePOFormSchema>
