import { useQuery } from '@tanstack/react-query'

import { inventoryCountApi } from './api'
import { inventoryCountKeys } from './query-keys'

import type { IGetInventoryCountsParams } from './types'

/**
 * Get all inventory counts
 */
export const useGetInventoryCounts = (params?: IGetInventoryCountsParams) => {
  return useQuery({
    queryKey: inventoryCountKeys.list(params),
    queryFn: () => inventoryCountApi.getCounts(params),
  })
}

// Alias
export const useInventoryCountList = useGetInventoryCounts

/**
 * Get inventory count by ID with items
 */
export const useInventoryCountById = (id: number) => {
  return useQuery({
    queryKey: inventoryCountKeys.detail(id),
    queryFn: () => inventoryCountApi.getCountById(id),
    enabled: !!id,
  })
}

/**
 * Get variance summary for count
 */
export const useCountVarianceSummary = (id: number) => {
  return useQuery({
    queryKey: inventoryCountKeys.variance(id),
    queryFn: () => inventoryCountApi.getVarianceSummary(id),
    enabled: !!id,
  })
}
