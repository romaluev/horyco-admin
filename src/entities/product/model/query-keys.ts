/**
 * Product Query Keys Factory
 * Centralized query key management for React Query
 */

import type { IGetProductsParams } from './types';

export const productKeys = {
  all: () => ['products'] as const,
  lists: () => [...productKeys.all(), 'list'] as const,
  list: (params?: IGetProductsParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all(), 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  productTypes: {
    all: () => ['product-types'] as const,
    lists: () => [...productKeys.productTypes.all(), 'list'] as const,
    list: (params?: { page?: number; limit?: number }) =>
      [...productKeys.productTypes.lists(), params] as const,
    details: () => [...productKeys.productTypes.all(), 'detail'] as const,
    detail: (id: number) => [...productKeys.productTypes.details(), id] as const
  }
} as const;
