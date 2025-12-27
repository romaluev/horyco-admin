/**
 * Stock Movement Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetMovementsParams } from './types'

export const stockMovementKeys = {
  all: () => ['stockMovements'] as const,
  lists: () => [...stockMovementKeys.all(), 'list'] as const,
  list: (params?: IGetMovementsParams) =>
    [...stockMovementKeys.lists(), params] as const,
  summary: (params?: { warehouseId?: number; from?: string; to?: string }) =>
    [...stockMovementKeys.all(), 'summary', params] as const,
}
