/**
 * Modifier Group Query Hooks
 */

import { useQuery, type UseQueryOptions } from '@tanstack/react-query'

import { modifierGroupApi } from './api'
import { modifierGroupKeys } from './query-keys'

import type {
  IModifierGroup,
  IModifier,
  IGetModifierGroupsParams,
  IGetModifiersParams,
} from './types'

export const useGetModifierGroups = (
  params?: IGetModifierGroupsParams,
  options?: Omit<
    UseQueryOptions<IModifierGroup[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: modifierGroupKeys.list(params),
    queryFn: () => modifierGroupApi.getModifierGroups(params),
    ...options,
  })
}

export const useGetModifierGroupById = (
  id: number,
  options?: Omit<UseQueryOptions<IModifierGroup, Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: modifierGroupKeys.detail(id),
    queryFn: () => modifierGroupApi.getModifierGroupById(id),
    enabled: !!id,
    ...options,
  })
}

export const useGetProductModifierGroups = (
  productId: number,
  options?: Omit<
    UseQueryOptions<IModifierGroup[], Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery({
    queryKey: modifierGroupKeys.productGroups(productId),
    queryFn: () => modifierGroupApi.getProductModifierGroups(productId),
    enabled: !!productId,
    ...options,
  })
}

export const useGetModifiers = (
  params?: IGetModifiersParams,
  options?: Omit<UseQueryOptions<IModifier[], Error>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: modifierGroupKeys.modifiers.list(params),
    queryFn: () => modifierGroupApi.getModifiers(params),
    ...options,
  })
}
