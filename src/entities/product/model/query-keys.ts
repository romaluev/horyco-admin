/**
 * Product Query Keys Factory
 * Centralized query key management for React Query
 */

import type { IGetProductsParams } from './types'

export const productKeys = {
  all: () => ['products'] as const,
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (params?: IGetProductsParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
} as const
