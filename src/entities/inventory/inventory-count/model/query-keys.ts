import type { IGetInventoryCountsParams } from './types'

export const inventoryCountKeys = {
  all: ['inventory-counts'] as const,
  lists: () => [...inventoryCountKeys.all, 'list'] as const,
  list: (params?: IGetInventoryCountsParams) =>
    [...inventoryCountKeys.lists(), params] as const,
  details: () => [...inventoryCountKeys.all, 'detail'] as const,
  detail: (id: number) => [...inventoryCountKeys.details(), id] as const,
  variance: (id: number) =>
    [...inventoryCountKeys.detail(id), 'variance'] as const,
}
