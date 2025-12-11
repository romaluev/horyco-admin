/**
 * Modifier Query Hooks
 * React Query hooks for fetching modifier data
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { modifierApi } from './api'
import { modifierKeys } from './query-keys'

import type { IModifier, IGetModifiersParams } from './types'

/**
 * Get all modifiers with optional filters
 */
export const useGetModifiers = (
  params?: IGetModifiersParams,
  options?: Omit<UseQueryOptions<IModifier[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: modifierKeys.list(params),
    queryFn: () => modifierApi.getModifiers(params),
    ...options,
  })
}

/**
 * Get modifier by ID
 */
export const useGetModifierById = (
  id: number,
  options?: Omit<UseQueryOptions<IModifier, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: modifierKeys.detail(id),
    queryFn: () => modifierApi.getModifierById(id),
    enabled: !!id,
    ...options,
  })
}
