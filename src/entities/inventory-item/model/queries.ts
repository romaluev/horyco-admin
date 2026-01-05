/**
 * Inventory Item Query Hooks
 * TanStack React Query hooks for fetching inventory item data
 */

import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'

import { inventoryItemApi } from './api'
import { inventoryItemKeys } from './query-keys'
import type {
  IInventoryItem,
  IInventoryItemsResponse,
  IGetInventoryItemsParams,
  IUnitConversion,
} from './types'

export const useGetInventoryItems = (
  params?: IGetInventoryItemsParams,
  options?: Omit<UseQueryOptions<IInventoryItemsResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: inventoryItemKeys.list(params),
    queryFn: () => inventoryItemApi.getItems(params),
    ...options,
  })
}

export const useGetInventoryItemById = (
  id: number,
  options?: Omit<UseQueryOptions<IInventoryItem>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: inventoryItemKeys.detail(id),
    queryFn: () => inventoryItemApi.getItemById(id),
    enabled: !!id,
    ...options,
  })
}

export const useGetItemConversions = (
  itemId: number,
  options?: Omit<UseQueryOptions<IUnitConversion[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: inventoryItemKeys.conversions(itemId),
    queryFn: () => inventoryItemApi.getItemConversions(itemId),
    enabled: !!itemId,
    ...options,
  })
}
