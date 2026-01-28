/**
 * Inventory Item Query Hooks
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { inventoryItemApi } from './api'
import { inventoryItemKeys } from './query-keys'

import type {
  IInventoryItem,
  IGetInventoryItemsParams,
  IUnitConversion,
} from './types'

/**
 * Get all inventory items
 */
export const useGetInventoryItems = (
  params?: IGetInventoryItemsParams,
  options?: Omit<
    UseQueryOptions<IInventoryItem[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: inventoryItemKeys.list(params),
    queryFn: () => inventoryItemApi.getItems(params),
    ...options,
  })
}

/**
 * Get inventory item by ID
 */
export const useGetInventoryItemById = (
  id: number,
  options?: Omit<UseQueryOptions<IInventoryItem, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: inventoryItemKeys.detail(id),
    queryFn: () => inventoryItemApi.getItemById(id),
    enabled: !!id,
    ...options,
  })
}

/**
 * Get all item categories
 */
export const useGetItemCategories = (
  options?: Omit<UseQueryOptions<string[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: inventoryItemKeys.categories(),
    queryFn: () => inventoryItemApi.getCategories(),
    ...options,
  })
}

/**
 * Get unit conversions for item
 */
export const useGetItemConversions = (
  id: number,
  options?: Omit<
    UseQueryOptions<IUnitConversion[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: inventoryItemKeys.conversions(id),
    queryFn: () => inventoryItemApi.getItemConversions(id),
    enabled: !!id,
    ...options,
  })
}
