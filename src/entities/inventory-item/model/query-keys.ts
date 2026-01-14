/**
 * Inventory Item Query Keys Factory
 */

import type { IGetInventoryItemsParams } from './types'

export const inventoryItemKeys = {
  all: () => ['inventory-items'] as const,
  lists: () => [...inventoryItemKeys.all(), 'list'] as const,
  list: (params?: IGetInventoryItemsParams) =>
    [...inventoryItemKeys.lists(), params] as const,
  details: () => [...inventoryItemKeys.all(), 'detail'] as const,
  detail: (id: number) => [...inventoryItemKeys.details(), id] as const,
  conversions: (id: number) =>
    [...inventoryItemKeys.detail(id), 'conversions'] as const,
  categories: () => [...inventoryItemKeys.all(), 'categories'] as const,
} as const
