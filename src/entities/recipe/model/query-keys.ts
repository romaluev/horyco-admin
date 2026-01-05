/**
 * Recipe Query Keys Factory
 * TanStack Query key management for cache invalidation
 */

import type { IGetRecipesParams } from './types'

export const recipeKeys = {
  all: () => ['recipes'] as const,
  lists: () => [...recipeKeys.all(), 'list'] as const,
  list: (params?: IGetRecipesParams) => [...recipeKeys.lists(), params] as const,
  details: () => [...recipeKeys.all(), 'detail'] as const,
  detail: (id: number) => [...recipeKeys.details(), id] as const,
  byProduct: (productId: number) =>
    [...recipeKeys.all(), 'product', productId] as const,
  byModifier: (modifierId: number) =>
    [...recipeKeys.all(), 'modifier', modifierId] as const,
  byItem: (itemId: number) => [...recipeKeys.all(), 'item', itemId] as const,
}
