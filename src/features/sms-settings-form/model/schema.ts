import { z } from 'zod'

export const smsSettingsSchema = z.object({
  smsEnabled: z.boolean().default(false),
  smsProvider: z.enum(['playmobile', 'eskiz']).default('playmobile'),

  // Playmobile
  playmobileLogin: z.string().optional(),
  playmobilePassword: z.string().optional(),
  playmobileSender: z.string().optional(),

  // Eskiz
  eskizEmail: z.string().email('Неверный email').optional().or(z.literal('')),
  eskizPassword: z.string().optional(),
  eskizSender: z.string().optional(),
})

export type SmsSettingsFormData = z.infer<typeof smsSettingsSchema>
