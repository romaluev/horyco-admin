/**
 * Addition Query Keys Factory
 * Centralized query key management for React Query
 */

import type { IGetAdditionsParams } from './types';

export const additionKeys = {
  all: () => ['additions'] as const,
  lists: () => [...additionKeys.all(), 'list'] as const,
  list: (params?: IGetAdditionsParams) =>
    [...additionKeys.lists(), params] as const,
  details: () => [...additionKeys.all(), 'detail'] as const,
  detail: (id: number) => [...additionKeys.details(), id] as const,
  byProduct: (productId: number) =>
    [...additionKeys.all(), 'product', productId] as const,

  items: {
    all: () => ['addition-items'] as const,
    byAddition: (additionId: number) =>
      [...additionKeys.items.all(), 'addition', additionId] as const
  }
} as const;
