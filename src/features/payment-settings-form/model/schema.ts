import { z } from 'zod'

export const paymentSettingsSchema = z.object({
  // PayMe
  paymeEnabled: z.boolean().default(false),
  paymeMerchantId: z.string().optional(),
  paymeKey: z.string().optional(),

  // Click
  clickEnabled: z.boolean().default(false),
  clickMerchantId: z.string().optional(),
  clickSecretKey: z.string().optional(),

  // Uzum
  uzumEnabled: z.boolean().default(false),
  uzumMerchantId: z.string().optional(),
  uzumSecretKey: z.string().optional(),
})

export type PaymentSettingsFormData = z.infer<typeof paymentSettingsSchema>
