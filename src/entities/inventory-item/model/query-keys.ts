/**
 * Inventory Item Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetInventoryItemsParams } from './types'

export const inventoryItemKeys = {
  all: () => ['inventoryItems'] as const,
  lists: () => [...inventoryItemKeys.all(), 'list'] as const,
  list: (params?: IGetInventoryItemsParams) =>
    [...inventoryItemKeys.lists(), params] as const,
  details: () => [...inventoryItemKeys.all(), 'detail'] as const,
  detail: (id: number) => [...inventoryItemKeys.details(), id] as const,
  conversions: (itemId: number) =>
    [...inventoryItemKeys.detail(itemId), 'conversions'] as const,
}
