import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

import {
  BRANCH_NAME_MIN_LENGTH,
  BRANCH_NAME_MAX_LENGTH,
  BRANCH_ADDRESS_MIN_LENGTH,
  BRANCH_ADDRESS_MAX_LENGTH,
  BRANCH_EMAIL_MIN_LENGTH,
} from './constants'

export const branchFormSchema = z.object({
  name: z
    .string()
    .min(BRANCH_NAME_MIN_LENGTH, 'Название обязательно')
    .max(BRANCH_NAME_MAX_LENGTH, `Максимум ${BRANCH_NAME_MAX_LENGTH} символов`),
  address: z
    .string()
    .min(
      BRANCH_ADDRESS_MIN_LENGTH,
      `Адрес филиала должен содержать минимум ${BRANCH_ADDRESS_MIN_LENGTH} символов`
    )
    .max(
      BRANCH_ADDRESS_MAX_LENGTH,
      `Адрес филиала должен содержать максимум ${BRANCH_ADDRESS_MAX_LENGTH} символов`
    ),
  phoneNumber: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true
        return isValidPhoneNumber(val)
      },
      { message: 'Неверный формат телефона' }
    ),
  email: z
    .string()
    .min(BRANCH_EMAIL_MIN_LENGTH, 'Email обязателен')
    .email('Неверный формат email'),
  metadata: z.record(z.unknown()).optional(),
})

export type BranchFormData = z.infer<typeof branchFormSchema>
