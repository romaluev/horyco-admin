import { z } from 'zod'

/* eslint-disable no-magic-numbers */

/**
 * Onboarding validation schemas (Zod)
 * All validation logic for onboarding features
 */

/**
 * Business Identity step schema (NEW API)
 */
export const businessInfoSchema = z.object({
  businessName: z
    .string()
    .min(3, { message: 'Введите название заведения (минимум 3 символа)' }),
  businessType: z.string().min(1, { message: 'Выберите тип заведения' }),
  slug: z
    .string()
    .min(3, { message: 'Введите slug (минимум 3 символа)' })
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug может содержать только строчные буквы, цифры и дефисы',
    }),
  logoUrl: z
    .string()
    .url({ message: 'Введите корректный URL' })
    .optional()
    .or(z.literal('')),
})

export type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>

/**
 * Branch Setup step schema
 */
const dayHoursSchema = z.object({
  open: z.string(),
  close: z.string(),
  isClosed: z.boolean().optional(),
})

export const branchSetupSchema = z.object({
  branchName: z.string().min(2, { message: 'Введите название филиала' }),
  address: z.string().min(10, { message: 'Введите полный адрес' }),
  city: z.string().min(1, { message: 'Выберите город' }),
  region: z.string().min(1, { message: 'Выберите регион' }),
  businessHours: z.object({
    monday: dayHoursSchema,
    tuesday: dayHoursSchema,
    wednesday: dayHoursSchema,
    thursday: dayHoursSchema,
    friday: dayHoursSchema,
    saturday: dayHoursSchema,
    sunday: dayHoursSchema,
  }),
  dineInEnabled: z.boolean(),
  takeawayEnabled: z.boolean(),
  deliveryEnabled: z.boolean(),
})

export type BranchSetupFormValues = z.infer<typeof branchSetupSchema>

/**
 * Staff Invite step schema
 * Now includes per-branch permission management
 * Each invitation can have different permissions at different branches
 */
export const invitationSchema = z.object({
  fullName: z.string().min(2, { message: 'Введите полное имя' }),
  phone: z.string().min(4, { message: 'Введите корректный номер' }),
  email: z
    .string()
    .email({ message: 'Некорректный email' })
    .optional()
    .or(z.literal('')),
})

export const staffInviteSchema = z.object({
  invitations: z.array(invitationSchema).min(0),
})

export type InvitationFormValues = z.infer<typeof invitationSchema>
export type StaffInviteFormValues = z.infer<typeof staffInviteSchema>

/**
 * Branch permissions schema for onboarding
 * Maps branchId to permission IDs for that branch
 */
export const branchPermissionsSchema = z.record(
  z.string(),
  z.object({
    permissionIds: z.array(z.number()),
  })
)

export type BranchPermissionsMap = z.infer<typeof branchPermissionsSchema>
