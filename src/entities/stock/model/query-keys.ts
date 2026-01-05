/**
 * Stock Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetStockParams } from './types'

export const stockKeys = {
  all: () => ['stock'] as const,
  lists: () => [...stockKeys.all(), 'list'] as const,
  list: (params: IGetStockParams) => [...stockKeys.lists(), params] as const,
  byItem: (itemId: number) => [...stockKeys.all(), 'item', itemId] as const,
  low: (warehouseId?: number) => [...stockKeys.all(), 'low', warehouseId] as const,
  out: (warehouseId?: number) => [...stockKeys.all(), 'out', warehouseId] as const,
  summary: (warehouseId?: number) =>
    [...stockKeys.all(), 'summary', warehouseId] as const,
}
