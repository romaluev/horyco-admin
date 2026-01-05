/**
 * Writeoff Query Keys
 * Factory for TanStack Query cache keys
 */

import type { IWriteoffListParams } from './types'

export const writeoffKeys = {
  all: () => ['writeoffs'] as const,

  lists: () => [...writeoffKeys.all(), 'list'] as const,

  list: (branchId: number, params?: IWriteoffListParams) =>
    [...writeoffKeys.lists(), branchId, params] as const,

  details: () => [...writeoffKeys.all(), 'detail'] as const,

  detail: (id: number) => [...writeoffKeys.details(), id] as const,

  // Pending approvals
  pending: (branchId: number) =>
    [...writeoffKeys.all(), 'pending', branchId] as const,
}
