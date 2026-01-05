/**
 * Supplier Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetSuppliersParams, IGetPriceHistoryParams } from './types'

export const supplierKeys = {
  all: () => ['suppliers'] as const,
  lists: () => [...supplierKeys.all(), 'list'] as const,
  list: (params?: IGetSuppliersParams) => [...supplierKeys.lists(), params] as const,
  details: () => [...supplierKeys.all(), 'detail'] as const,
  detail: (id: number) => [...supplierKeys.details(), id] as const,
  items: (supplierId: number) =>
    [...supplierKeys.detail(supplierId), 'items'] as const,
  priceHistory: (supplierId: number, params?: IGetPriceHistoryParams) =>
    [...supplierKeys.detail(supplierId), 'priceHistory', params] as const,
}
