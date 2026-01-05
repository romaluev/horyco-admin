/**
 * Inventory Count Query Keys
 * Factory for TanStack Query cache keys
 */

import type { ICountListParams } from './types'

export const inventoryCountKeys = {
  all: () => ['inventory-counts'] as const,

  lists: () => [...inventoryCountKeys.all(), 'list'] as const,

  list: (branchId: number, params?: ICountListParams) =>
    [...inventoryCountKeys.lists(), branchId, params] as const,

  details: () => [...inventoryCountKeys.all(), 'detail'] as const,

  detail: (id: number) => [...inventoryCountKeys.details(), id] as const,

  variance: (id: number) =>
    [...inventoryCountKeys.all(), 'variance', id] as const,

  // Pending approvals
  pending: (branchId: number) =>
    [...inventoryCountKeys.all(), 'pending', branchId] as const,

  // In-progress counts
  inProgress: (branchId: number) =>
    [...inventoryCountKeys.all(), 'in-progress', branchId] as const,
}
