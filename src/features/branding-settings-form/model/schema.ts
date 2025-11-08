import { z } from 'zod'

export const brandingSettingsSchema = z.object({
  brandName: z.string().min(1, 'Название бренда обязательно').max(100),
  brandDescription: z.string().max(500).optional(),
  logoUrl: z.string().url('Неверный URL').optional().or(z.literal('')),
  logoDarkUrl: z.string().url('Неверный URL').optional().or(z.literal('')),
  faviconUrl: z.string().url('Неверный URL').optional().or(z.literal('')),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Неверный формат цвета (например, #FF5733)')
    .optional()
    .or(z.literal('')),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Неверный формат цвета (например, #FF5733)')
    .optional()
    .or(z.literal('')),
  facebookUrl: z.string().url('Неверный URL').optional().or(z.literal('')),
  instagramUrl: z.string().optional(),
  telegramUrl: z.string().optional(),
  websiteUrl: z.string().url('Неверный URL').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Неверный email').optional().or(z.literal('')),
  contactAddress: z.string().max(200).optional(),
})

export type BrandingSettingsFormData = z.infer<typeof brandingSettingsSchema>
