/**
 * Inventory Count Query Hooks
 * TanStack React Query hooks for fetching inventory count data
 */

import { useQuery } from '@tanstack/react-query'

import { inventoryCountApi } from './api'
import { inventoryCountKeys } from './query-keys'
import type { ICountListParams } from './types'
import { CountStatus } from '@/shared/types/inventory'

export const useGetInventoryCounts = (
  branchId: number,
  params?: ICountListParams,
  enabled = true
) => {
  return useQuery({
    queryKey: inventoryCountKeys.list(branchId, params),
    queryFn: () => inventoryCountApi.getCounts(branchId, params),
    enabled: enabled && !!branchId,
  })
}

export const useGetInventoryCountById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: inventoryCountKeys.detail(id),
    queryFn: () => inventoryCountApi.getCountById(id),
    enabled: enabled && !!id,
  })
}

export const useGetCountVarianceSummary = (id: number, enabled = true) => {
  return useQuery({
    queryKey: inventoryCountKeys.variance(id),
    queryFn: () => inventoryCountApi.getVarianceSummary(id),
    enabled: enabled && !!id,
  })
}

export const useGetPendingCounts = (branchId: number, enabled = true) => {
  return useQuery({
    queryKey: inventoryCountKeys.pending(branchId),
    queryFn: () =>
      inventoryCountApi.getCounts(branchId, {
        status: CountStatus.PENDING_APPROVAL,
      }),
    enabled: enabled && !!branchId,
    select: (data) => data.data,
  })
}

export const useGetInProgressCounts = (branchId: number, enabled = true) => {
  return useQuery({
    queryKey: inventoryCountKeys.inProgress(branchId),
    queryFn: () =>
      inventoryCountApi.getCounts(branchId, {
        status: CountStatus.IN_PROGRESS,
      }),
    enabled: enabled && !!branchId,
    select: (data) => data.data,
  })
}
