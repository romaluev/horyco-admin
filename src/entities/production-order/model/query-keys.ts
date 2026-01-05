/**
 * Production Order Query Keys
 * Factory for TanStack Query cache keys
 */

import type { IProductionOrderListParams } from './types'

export const productionOrderKeys = {
  all: () => ['production-orders'] as const,

  lists: () => [...productionOrderKeys.all(), 'list'] as const,

  list: (branchId: number, params?: IProductionOrderListParams) =>
    [...productionOrderKeys.lists(), branchId, params] as const,

  details: () => [...productionOrderKeys.all(), 'detail'] as const,

  detail: (id: number) => [...productionOrderKeys.details(), id] as const,

  // Availability check
  availability: (id: number) =>
    [...productionOrderKeys.all(), 'availability', id] as const,

  // Production suggestions
  suggestions: (branchId: number, warehouseId?: number) =>
    [...productionOrderKeys.all(), 'suggestions', branchId, warehouseId] as const,

  // By status
  planned: (branchId: number) =>
    [...productionOrderKeys.all(), 'planned', branchId] as const,

  inProgress: (branchId: number) =>
    [...productionOrderKeys.all(), 'in-progress', branchId] as const,
}
