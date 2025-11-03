/**
 * Modifier Group Query Keys Factory
 */

import type { IGetModifierGroupsParams, IGetModifiersParams } from './types'

export const modifierGroupKeys = {
  all: () => ['modifier-groups'] as const,
  lists: () => [...modifierGroupKeys.all(), 'list'] as const,
  list: (params?: IGetModifierGroupsParams) =>
    [...modifierGroupKeys.lists(), params] as const,
  details: () => [...modifierGroupKeys.all(), 'detail'] as const,
  detail: (id: number) => [...modifierGroupKeys.details(), id] as const,
  productGroups: (productId: number) =>
    ['products', productId, 'modifier-groups'] as const,
  modifiers: {
    all: () => ['modifiers'] as const,
    lists: () => [...modifierGroupKeys.modifiers.all(), 'list'] as const,
    list: (params?: IGetModifiersParams) =>
      [...modifierGroupKeys.modifiers.lists(), params] as const,
  },
}
