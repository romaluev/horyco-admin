/**
 * Category Query Keys Factory
 * Centralized query key management for React Query
 */

import type { IGetCategoriesParams } from './types';

export const categoryKeys = {
  all: () => ['categories'] as const,
  lists: () => [...categoryKeys.all(), 'list'] as const,
  list: (params?: IGetCategoriesParams) =>
    [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all(), 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  tree: () => [...categoryKeys.all(), 'tree'] as const
} as const;
