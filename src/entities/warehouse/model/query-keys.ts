/**
 * Warehouse Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetWarehousesParams } from './types'

export const warehouseKeys = {
  all: () => ['warehouses'] as const,
  lists: () => [...warehouseKeys.all(), 'list'] as const,
  list: (params?: IGetWarehousesParams) => [...warehouseKeys.lists(), params] as const,
  details: () => [...warehouseKeys.all(), 'detail'] as const,
  detail: (id: number) => [...warehouseKeys.details(), id] as const,
}
