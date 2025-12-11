/**
 * Business types constants
 * Must match backend validation values exactly
 */

export const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Ресторан' },
  { value: 'cafe', label: 'Кафе' },
  { value: 'fast_food', label: 'Фаст-фуд' },
  { value: 'bar', label: 'Бар' },
  { value: 'bakery', label: 'Пекарня' },
  { value: 'food_truck', label: 'Фуд-трак' },
  { value: 'catering', label: 'Кейтеринг' },
  { value: 'other', label: 'Другое' },
] as const

export type BusinessType = (typeof BUSINESS_TYPES)[number]['value']
