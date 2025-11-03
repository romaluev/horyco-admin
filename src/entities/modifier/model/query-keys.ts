/**
 * Modifier Query Keys Factory
 * Centralized query key management for React Query
 */

import type { IGetModifiersParams } from './types';

export const modifierKeys = {
  all: () => ['modifiers'] as const,
  lists: () => [...modifierKeys.all(), 'list'] as const,
  list: (params?: IGetModifiersParams) =>
    [...modifierKeys.lists(), params] as const,
  details: () => [...modifierKeys.all(), 'detail'] as const,
  detail: (id: number) => [...modifierKeys.details(), id] as const
} as const;
