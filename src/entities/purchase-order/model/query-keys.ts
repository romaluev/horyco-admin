/**
 * Purchase Order Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetPurchaseOrdersParams } from './types'

export const purchaseOrderKeys = {
  all: () => ['purchaseOrders'] as const,
  lists: () => [...purchaseOrderKeys.all(), 'list'] as const,
  list: (params?: IGetPurchaseOrdersParams) =>
    [...purchaseOrderKeys.lists(), params] as const,
  details: () => [...purchaseOrderKeys.all(), 'detail'] as const,
  detail: (id: number) => [...purchaseOrderKeys.details(), id] as const,
  bySupplier: (supplierId: number) =>
    [...purchaseOrderKeys.all(), 'supplier', supplierId] as const,
  upcoming: () => [...purchaseOrderKeys.all(), 'upcoming'] as const,
}
