/**
 * Branch Override Form Contract
 * Validation schemas for branch override forms
 * Based on ADMIN_MENU_MANAGEMENT.md upsert endpoint
 */

import { z } from 'zod'

/**
 * Upsert branch override form schema
 * Used for both creating and updating overrides
 * null values mean "use base product value"
 */
export const upsertBranchOverrideFormSchema = z.object({
  productId: z.number({
    required_error: 'Выберите продукт',
  }),
  branchId: z.number({
    required_error: 'Выберите филиал',
  }),
  overridePrice: z
    .number({
      invalid_type_error: 'Введите корректную цену',
    })
    .min(0, 'Цена не может быть отрицательной')
    .nullable()
    .optional(),
  overrideAvailability: z.boolean().nullable().optional(),
  overrideImage: z.string().url().nullable().optional(),
  overrideName: z.string().max(200).nullable().optional(),
})

/**
 * Upsert branch override form type
 */
export type UpsertBranchOverrideFormValues = z.infer<
  typeof upsertBranchOverrideFormSchema
>
