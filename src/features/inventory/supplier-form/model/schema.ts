import * as z from 'zod'

export const supplierFormSchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  code: z.string().optional(),
  legalName: z.string().optional(),
  taxId: z.string().optional(),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  address: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  paymentTerms: z.string().optional(),
  leadTimeDays: z.number().min(0, 'Срок доставки не может быть отрицательным').default(1),
  minimumOrder: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  notes: z.string().optional(),
})

export type SupplierFormValues = z.infer<typeof supplierFormSchema>

export const paymentTermsOptions = [
  { value: 'Предоплата', label: 'Предоплата' },
  { value: 'При получении', label: 'При получении' },
  { value: 'Отсрочка 7 дней', label: 'Отсрочка 7 дней' },
  { value: 'Отсрочка 14 дней', label: 'Отсрочка 14 дней' },
  { value: 'Отсрочка 30 дней', label: 'Отсрочка 30 дней' },
]
