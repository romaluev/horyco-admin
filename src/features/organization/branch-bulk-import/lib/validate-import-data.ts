import { isValidPhoneNumber } from 'react-phone-number-input'

import {
  BRANCH_NAME_MIN_LENGTH,
  BRANCH_NAME_MAX_LENGTH,
  BRANCH_ADDRESS_MIN_LENGTH,
  BRANCH_ADDRESS_MAX_LENGTH,
} from '@/features/organization/branch-form/model/constants'

import type { ParsedCsvRow } from './parse-csv'
import type { IBulkBranchItem } from '@/entities/organization/branch'

export interface ValidationError {
  row: number
  field: string
  message: string
}

export interface ValidatedData {
  valid: IBulkBranchItem[]
  invalid: ValidationError[]
}

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateImportData = (data: ParsedCsvRow[]): ValidatedData => {
  const valid: IBulkBranchItem[] = []
  const invalid: ValidationError[] = []

  data.forEach((row, index) => {
    const rowNumber = index + 2
    const errors: ValidationError[] = []

    const name = row.name || row.Name || row.название || ''
    const address = row.address || row.Address || row.адрес || ''
    const phoneNumber = row.phoneNumber || row.phone || row.телефон || ''
    const email = row.email || row.Email || row.почта || ''

    if (
      !name ||
      name.length < BRANCH_NAME_MIN_LENGTH ||
      name.length > BRANCH_NAME_MAX_LENGTH
    ) {
      errors.push({
        row: rowNumber,
        field: 'name',
        message: `Название обязательно (${BRANCH_NAME_MIN_LENGTH}-${BRANCH_NAME_MAX_LENGTH} символов)`,
      })
    }

    if (
      !address ||
      address.length < BRANCH_ADDRESS_MIN_LENGTH ||
      address.length > BRANCH_ADDRESS_MAX_LENGTH
    ) {
      errors.push({
        row: rowNumber,
        field: 'address',
        message: `Адрес филиала должен содержать от ${BRANCH_ADDRESS_MIN_LENGTH} до ${BRANCH_ADDRESS_MAX_LENGTH} символов`,
      })
    }

    if (phoneNumber && !isValidPhoneNumber(phoneNumber)) {
      errors.push({
        row: rowNumber,
        field: 'phoneNumber',
        message: 'Неверный формат телефона',
      })
    }

    if (email && !isValidEmail(email)) {
      errors.push({
        row: rowNumber,
        field: 'email',
        message: 'Неверный формат email',
      })
    }

    if (errors.length > 0) {
      invalid.push(...errors)
    } else {
      const validItem: IBulkBranchItem = {
        name,
        address,
        phone: phoneNumber || undefined,
        email: email || undefined,
      }
      valid.push(validItem)
    }
  })

  return { valid, invalid }
}
