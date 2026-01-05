import * as z from 'zod'

export const supplierFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>

export const supplierItemFormSchema = z.object({
  inventoryItemId: z.number().min(1, 'Выберите товар'),
  supplierSku: z.string().optional(),
  price: z.number().min(0, 'Цена не может быть отрицательной'),
  minOrderQty: z.number().min(0).optional(),
  leadTimeDays: z.number().min(0).optional(),
})

export type SupplierItemFormValues = z.infer<typeof supplierItemFormSchema>
